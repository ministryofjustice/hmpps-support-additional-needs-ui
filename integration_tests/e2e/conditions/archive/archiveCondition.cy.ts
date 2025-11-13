import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import Error404Page from '../../../pages/error404'
import ConditionsPage from '../../../pages/profile/conditionsPage'
import ArchiveConditionReasonPage from '../../../pages/conditions/archiveConditionReasonPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import OverviewPage from '../../../pages/profile/overviewPage'

context('Archive a Condition', () => {
  const prisonNumber = 'G6115VJ'
  const conditionReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to archive conditions
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber, conditionReference })
    cy.task('stubGetCondition', { prisonNumber, conditionReference })
    cy.task('stubArchiveCondition', { prisonNumber, conditionReference })
  })

  it('should archive a prisoners Condition, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Conditions', ConditionsPage)
      .clickToArchiveNthCondition(1)

    // When
    Page.verifyOnPage(ArchiveConditionReasonPage) //
      .hasNoErrors()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ArchiveConditionReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('archiveReason')
      // Set a new answer
      .enterReason('Condition added in error and is not relevant')
      .submitPageTo(ConditionsPage)

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .hasSuccessMessage('Condition moved to History')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/conditions/${conditionReference}/archive`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.archiveReason == 'Condition added in error and is not relevant' " +
              ')]',
          ),
        ),
    )
  })

  it('should not archive a Condition given API returns an error response', () => {
    // Given
    cy.task('stubArchiveCondition500Error', { prisonNumber, conditionReference })

    cy.signIn()
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/archive/reason`)

    Page.verifyOnPage(ArchiveConditionReasonPage) //
      .enterReason('Condition added in error and is not relevant')

    // When
    Page.verifyOnPage(ArchiveConditionReasonPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ArchiveConditionReasonPage) //
      .submitPageTo(ArchiveConditionReasonPage) // Submit the page but expect to stay on the Condition Reason page due to API error

    // Then
    Page.verifyOnPage(ArchiveConditionReasonPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving condition returns an error', () => {
    // Given
    cy.task('stubGetCondition500Error', { prisonNumber, conditionReference })

    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given condition does not exist', () => {
    // Given
    cy.task('stubGetCondition404Error', { prisonNumber, conditionReference })

    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the archive condition page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to archive conditions
    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/archive/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
