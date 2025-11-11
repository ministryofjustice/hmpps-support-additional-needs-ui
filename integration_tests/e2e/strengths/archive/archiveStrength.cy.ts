import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import StrengthsPage from '../../../pages/profile/strengthsPage'
import Error404Page from '../../../pages/error404'
import OverviewPage from '../../../pages/profile/overviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import ArchiveStrengthReasonPage from '../../../pages/strengths/archiveStrengthReasonPage'

context('Archive a Strength', () => {
  const prisonNumber = 'G6115VJ'
  const strengthReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to archive strengths
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber, strengthReference })
    cy.task('stubGetStrength', { prisonNumber, strengthReference })
    cy.task('stubArchiveStrength', { prisonNumber, strengthReference })
  })

  it('should archive a prisoners Strength, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Strengths', StrengthsPage)
      .clickToArchiveNthNonAlnStrength(1)

    // When
    Page.verifyOnPage(ArchiveStrengthReasonPage) //
      .hasNoErrors()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ArchiveStrengthReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('archiveReason')
      // Set a new answer
      .enterReason('Strength added in error and is not relevant')
      .submitPageTo(StrengthsPage)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .hasSuccessMessage('Strength moved to History')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/strengths/${strengthReference}/archive`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.archiveReason == 'Strength added in error and is not relevant' " +
              ')]',
          ),
        ),
    )
  })

  it('should not archive a Strength given API returns an error response', () => {
    // Given
    cy.task('stubArchiveStrength500Error', { prisonNumber, strengthReference })

    cy.signIn()
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/archive/reason`)

    Page.verifyOnPage(ArchiveStrengthReasonPage) //
      .enterReason('Strength added in error and is not relevant')

    // When
    Page.verifyOnPage(ArchiveStrengthReasonPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ArchiveStrengthReasonPage) //
      .submitPageTo(ArchiveStrengthReasonPage) // Submit the page but expect to stay on the Strength Reason page due to API error

    // Then
    Page.verifyOnPage(ArchiveStrengthReasonPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving strength returns an error', () => {
    // Given
    cy.task('stubGetStrength500Error', { prisonNumber, strengthReference })

    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given strength does not exist', () => {
    // Given
    cy.task('stubGetStrength404Error', { prisonNumber, strengthReference })

    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the archive strength page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to archive strengths
    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
