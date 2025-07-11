import Page from '../../../pages/page'
import ReasonPage from '../../../pages/education-support-plan/refuse-plan/reasonPage'
import OverviewPage from '../../../pages/profile/overviewPage'
import PlanCreationScheduleExemptionReason from '../../../../server/enums/planCreationScheduleExemptionReason'
import { patchRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context('Refuse an Education Support Plan', () => {
  const prisonNumber = 'H4115SD'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
    cy.task('stubUpdateEducationSupportPlanCreationStatus', prisonNumber)
  })

  it('should be able to navigate directly to the refuse Education Support Plan page', () => {
    // Given

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/refuse-plan/reason`)

    // Then
    Page.verifyOnPage(ReasonPage)
  })

  it('should refuse a prisoners Education Support Plan, triggering validation on every screen', () => {
    // Given
    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .actionsCardContainsEducationSupportPlanActions()
      .clickRefuseEducationSupportPlanButton()

    // When
    Page.verifyOnPage(ReasonPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('refusalReason')
      // submit the page with optional details too long, triggering different validation
      .selectReason(PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED)
      .enterDetails('a'.repeat(201))
      .submitPageTo(ReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('EXEMPT_NOT_REQUIRED_refusalDetails')
      // enter valid details and submit the form
      .selectReason(PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE)
      .enterDetails('Chris failed to engage properly with me and refused to setup a plan')
      .submitPageTo(OverviewPage)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Refusal of education support plan recorded')
    cy.wiremockVerify(
      patchRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/plan-creation-schedule/status`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.status == 'EXEMPT_PRISONER_NOT_COMPLY' && " +
              "@.exemptionReason == 'EXEMPT_REFUSED_TO_ENGAGE' && " +
              "@.exemptionDetail == 'Chris failed to engage properly with me and refused to setup a plan'" +
              ')]',
          ),
        ),
    )
  })

  it('should not refuse a prisoners Education Support Plan given API returns an error response', () => {
    // Given
    cy.task('stubUpdateEducationSupportPlanCreationStatus500Error', prisonNumber)

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .actionsCardContainsEducationSupportPlanActions()
      .clickRefuseEducationSupportPlanButton()
    Page.verifyOnPage(ReasonPage) //
      .apiErrorBannerIsNotDisplayed()

    // When
    Page.verifyOnPage(ReasonPage) //
      .selectReason(PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE)
      .enterDetails('Chris failed to engage properly with me and refused to setup a plan')
      .submitPageTo(ReasonPage) // Submit the page but expect to stay on the Reason page due to API error

    // Then
    Page.verifyOnPage(ReasonPage) //
      .apiErrorBannerIsDisplayed()
  })
})
