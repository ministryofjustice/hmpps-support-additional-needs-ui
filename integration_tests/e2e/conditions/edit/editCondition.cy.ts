import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import EditConditionDetailPage from '../../../pages/conditions/editConditionDetailPage'
import Error404Page from '../../../pages/error404'
import ConditionsPage from '../../../pages/profile/conditionsPage'
import ConditionSource from '../../../../server/enums/conditionSource'
import OverviewPage from '../../../pages/profile/overviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context('Edit a Condition', () => {
  const prisonNumber = 'G6115VJ'
  const conditionReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit conditions
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber, conditionReference })
    cy.task('stubGetCondition', { prisonNumber, conditionReference })
    cy.task('stubUpdateCondition', { prisonNumber, conditionReference })
  })

  it('should be able to navigate directly to the edit challenge page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/edit/detail`)

    // Then
    Page.verifyOnPage(EditConditionDetailPage)
  })

  it('should edit a prisoners Challenge, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Conditions', ConditionsPage)
      .clickToEditNthCondition(1)

    // When
    Page.verifyOnPage(EditConditionDetailPage) //
      .hasNoErrors()
      // Clear the condition details answer to trigger a validation error
      .clearConditionDetails()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(EditConditionDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('conditionDetails')
      // Set a new answer
      .enterConditionDetails('Discussed with healthcare, occurred over 5 years ago')
      .submitPageTo(ConditionsPage)

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .hasSuccessMessage('Condition updated')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/conditions/${conditionReference}`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.source == 'SELF_DECLARED' && " +
              "@.conditionDetails == 'Discussed with healthcare, occurred over 5 years ago' " +
              ')]',
          ),
        ),
    )
  })

  it('should not edit a Condition given API returns an error response', () => {
    // Given
    cy.task('stubUpdateCondition500Error', { prisonNumber, conditionReference })

    cy.signIn()
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/edit/detail`)

    Page.verifyOnPage(EditConditionDetailPage) //
      .enterConditionDetails('Discussed with healthcare, occurred over 5 years ago')
      .selectHowConditionWasDiagnosed(ConditionSource.CONFIRMED_DIAGNOSIS)

    // When
    Page.verifyOnPage(EditConditionDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(EditConditionDetailPage) //
      .submitPageTo(EditConditionDetailPage) // Submit the page but expect to stay on the Condition Detail page due to API error

    // Then
    Page.verifyOnPage(EditConditionDetailPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving challenge returns an error', () => {
    // Given
    cy.task('stubGetCondition500Error', { prisonNumber, conditionReference })

    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given challenge does not exist', () => {
    // Given
    cy.task('stubGetCondition404Error', { prisonNumber, conditionReference })

    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the edit condition page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to edit conditions
    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
