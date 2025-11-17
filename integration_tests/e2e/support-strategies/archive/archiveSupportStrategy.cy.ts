import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import SupportStrategiesPage from '../../../pages/profile/supportStrategiesPage'
import ArchiveSupportStrategyReasonPage from '../../../pages/support-strategies/archiveSupportStrategyReasonPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import Error404Page from '../../../pages/error404'

context('Archive a Support Strategy', () => {
  const prisonNumber = 'G6115VJ'
  const supportStrategyReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to archive support strategies
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetSupportStrategies', { prisonNumber, supportStrategyReference })
    cy.task('stubGetSupportStrategy', { prisonNumber, supportStrategyReference })
    cy.task('stubArchiveSupportStrategy', { prisonNumber, supportStrategyReference })
  })

  it('should archive a prisoners Support Strategy, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Support strategies', SupportStrategiesPage)
      .clickToArchiveNthSupportStrategy(1)

    // When
    Page.verifyOnPage(ArchiveSupportStrategyReasonPage) //
      .hasNoErrors()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ArchiveSupportStrategyReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('archiveReason')
      // Set a new answer
      .enterReason('Support strategy added in error and is not relevant')
      .submitPageTo(SupportStrategiesPage)

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .hasSuccessMessage('Support strategy moved to History')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(
          `/support-additional-needs-api/profile/${prisonNumber}/support-strategies/${supportStrategyReference}/archive`,
        ),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.archiveReason == 'Support strategy added in error and is not relevant' " +
              ')]',
          ),
        ),
    )
  })

  it('should not archive a Support Strategy given API returns an error response', () => {
    // Given
    cy.task('stubArchiveSupportStrategy500Error', { prisonNumber, supportStrategyReference })

    cy.signIn()
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/archive/reason`)

    Page.verifyOnPage(ArchiveSupportStrategyReasonPage) //
      .enterReason('Support strategy added in error and is not relevant')

    // When
    Page.verifyOnPage(ArchiveSupportStrategyReasonPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ArchiveSupportStrategyReasonPage) //
      .submitPageTo(ArchiveSupportStrategyReasonPage) // Submit the page but expect to stay on the SupportStrategy Reason page due to API error

    // Then
    Page.verifyOnPage(ArchiveSupportStrategyReasonPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving Support strategy returns an error', () => {
    // Given
    cy.task('stubGetSupportStrategy500Error', { prisonNumber, supportStrategyReference })

    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/archive/reason`, {
      failOnStatusCode: false,
    })

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given Support Strategy does not exist', () => {
    // Given
    cy.task('stubGetSupportStrategy404Error', { prisonNumber, supportStrategyReference })

    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/archive/reason`, {
      failOnStatusCode: false,
    })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the archive Support Strategy page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to archive support strategies
    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/archive/reason`, {
      failOnStatusCode: false,
    })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
