import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import Error404Page from '../../../pages/error404'
import SupportStrategiesPage from '../../../pages/profile/supportStrategiesPage'
import SupportStrategyDetailPage from '../../../pages/support-strategies/supportStrategyDetailPage'

context('Edit a SupportStrategy', () => {
  const prisonNumber = 'G6115VJ'
  const supportStrategyReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit support strategies
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetSupportStrategies', { prisonNumber })
    cy.task('stubGetSupportStrategy', { prisonNumber, supportStrategyReference })
    cy.task('stubUpdateSupportStrategy', { prisonNumber, supportStrategyReference })
  })

  it('should be able to navigate directly to the edit support strategy page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/edit/detail`)

    // Then
    Page.verifyOnPage(SupportStrategyDetailPage)
  })

  it('should edit a prisoners Support Strategy, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Support strategies', SupportStrategiesPage)
      .clickToEditNthSupportStrategy(1)

    // When
    Page.verifyOnPage(SupportStrategyDetailPage) //
      .hasNoErrors()
      // Support Strategy already has an answer to Description - clear the answer to trigger a validation error
      .clearDescription()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(SupportStrategyDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('description')
      // Set a new answer
      .enterDescription('The use of pictorial flash cards will help with retaining facts')
      .submitPageTo(SupportStrategiesPage)

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .hasSuccessMessage('Support strategy updated')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(
          `/support-additional-needs-api/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`,
        ),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.detail == 'The use of pictorial flash cards will help with retaining facts' " +
              ')]',
          ),
        ),
    )
  })

  it('should not edit a Support Strategy given API returns an error response', () => {
    // Given
    cy.task('stubUpdateSupportStrategy500Error', { prisonNumber, supportStrategyReference })

    cy.signIn()
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/edit/detail`)

    Page.verifyOnPage(SupportStrategyDetailPage) //
      .enterDescription('The use of pictorial flash cards will help with retaining facts')

    // When
    Page.verifyOnPage(SupportStrategyDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(SupportStrategyDetailPage) //
      .submitPageTo(SupportStrategyDetailPage) // Submit the page but expect to stay on the Support Strategy Detail page due to API error

    // Then
    Page.verifyOnPage(SupportStrategyDetailPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving support strategy returns an error', () => {
    // Given
    cy.task('stubGetSupportStrategy500Error', { prisonNumber, supportStrategyReference })

    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given support strategy does not exist', () => {
    // Given
    cy.task('stubGetSupportStrategy404Error', { prisonNumber, supportStrategyReference })

    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the edit support strategy page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to edit support strategies
    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
