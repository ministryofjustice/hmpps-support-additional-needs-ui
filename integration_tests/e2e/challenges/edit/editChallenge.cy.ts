import Page from '../../../pages/page'
import Error404Page from '../../../pages/error404'
import ChallengesPage from '../../../pages/profile/challengesPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import ChallengeDetailPage from '../../../pages/challenges/challengeDetailPage'
import OverviewPage from '../../../pages/profile/overviewPage'
import ChallengeIdentificationSource from '../../../../server/enums/challengeIdentificationSource'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context('Edit a Challenge', () => {
  const prisonNumber = 'G6115VJ'
  const challengeReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit challenges
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber, challengeReference })
    cy.task('stubGetChallenge', { prisonNumber, challengeReference })
    cy.task('stubUpdateChallenge', { prisonNumber, challengeReference })
  })

  it('should be able to navigate directly to the edit challenge page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`)

    // Then
    Page.verifyOnPage(ChallengeDetailPage)
  })

  it('should edit a prisoners Challenge, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Challenges', ChallengesPage)
      .clickToEditNthNonAlnChallenge(1)

    // When
    Page.verifyOnPage(ChallengeDetailPage) //
      .hasNoErrors()
      // Challenge already has an answer to Description - clear the answer to trigger a validation error
      .clearDescription()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ChallengeDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('description')
      // Set a new answer
      .enterDescription(
        'Chris struggles showing empathy when dealing with others he feels are intellectually inferior to him',
      )
      // Select Other but submit without a reason
      .selectHowChallengeIdentified(ChallengeIdentificationSource.OTHER)
      .submitPageTo(ChallengeDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('howIdentifiedOther')
      .enterOtherHowChallengeIdentified('Chris has been observed by many people to struggle with empathy')
      .submitPageTo(ChallengesPage)

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .hasSuccessMessage('Challenge updated')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/challenges/${challengeReference}`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.symptoms == 'Chris struggles showing empathy when dealing with others he feels are intellectually inferior to him' && " +
              '@.howIdentified.size() == 2 && ' +
              "@.howIdentified[0] == 'EDUCATION_SKILLS_WORK' && " +
              "@.howIdentified[1] == 'OTHER' && " +
              "@.howIdentifiedOther == 'Chris has been observed by many people to struggle with empathy' " +
              ')]',
          ),
        ),
    )
  })

  it('should not edit a Challenge given API returns an error response', () => {
    // Given
    cy.task('stubUpdateChallenge500Error', { prisonNumber, challengeReference })

    cy.signIn()
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`)

    Page.verifyOnPage(ChallengeDetailPage) //
      .enterDescription(
        'Chris struggles showing empathy when dealing with others he feels are intellectually inferior to him',
      )
      .selectHowChallengeIdentified(ChallengeIdentificationSource.OTHER)
      .enterOtherHowChallengeIdentified('Chris has been observed by many people to struggle with empathy')

    // When
    Page.verifyOnPage(ChallengeDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ChallengeDetailPage) //
      .submitPageTo(ChallengeDetailPage) // Submit the page but expect to stay on the Challenge Detail page due to API error

    // Then
    Page.verifyOnPage(ChallengeDetailPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving challenge returns an error', () => {
    // Given
    cy.task('stubGetChallenge500Error', { prisonNumber, challengeReference })

    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given challenge does not exist', () => {
    // Given
    cy.task('stubGetChallenge404Error', { prisonNumber, challengeReference })

    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the edit challenge page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to edit challenges
    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
