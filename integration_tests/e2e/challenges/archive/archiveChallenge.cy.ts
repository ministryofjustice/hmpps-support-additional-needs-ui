import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import ChallengesPage from '../../../pages/profile/challengesPage'
import ArchiveChallengeReasonPage from '../../../pages/challenges/archiveChallengeReasonPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import Error404Page from '../../../pages/error404'

context('Archive a Challenge', () => {
  const prisonNumber = 'G6115VJ'
  const challengeReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to archive challenges
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber, challengeReference })
    cy.task('stubGetChallenge', { prisonNumber, challengeReference })
    cy.task('stubArchiveChallenge', { prisonNumber, challengeReference })
  })

  it('should archive a prisoners Challenge, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Challenges', ChallengesPage)
      .clickToArchiveNthNonAlnChallenge(1)

    // When
    Page.verifyOnPage(ArchiveChallengeReasonPage) //
      .hasNoErrors()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ArchiveChallengeReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('archiveReason')
      // Set a new answer
      .enterReason('Challenge added in error and is not relevant')
      .submitPageTo(ChallengesPage)

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .hasSuccessMessage('Challenge moved to History')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/challenges/${challengeReference}/archive`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.archiveReason == 'Challenge added in error and is not relevant' " +
              ')]',
          ),
        ),
    )
  })

  it('should not archive a Challenge given API returns an error response', () => {
    // Given
    cy.task('stubArchiveChallenge500Error', { prisonNumber, challengeReference })

    cy.signIn()
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/archive/reason`)

    Page.verifyOnPage(ArchiveChallengeReasonPage) //
      .enterReason('Challenge added in error and is not relevant')

    // When
    Page.verifyOnPage(ArchiveChallengeReasonPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ArchiveChallengeReasonPage) //
      .submitPageTo(ArchiveChallengeReasonPage) // Submit the page but expect to stay on the Challenge Reason page due to API error

    // Then
    Page.verifyOnPage(ArchiveChallengeReasonPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving challenge returns an error', () => {
    // Given
    cy.task('stubGetChallenge500Error', { prisonNumber, challengeReference })

    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given challenge does not exist', () => {
    // Given
    cy.task('stubGetChallenge404Error', { prisonNumber, challengeReference })

    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the archive challenge page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to archive challenges
    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
