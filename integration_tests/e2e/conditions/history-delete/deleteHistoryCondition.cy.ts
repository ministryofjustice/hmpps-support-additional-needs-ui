import Page from '../../../pages/page'
import ConditionsPage from '../../../pages/profile/conditionsPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import { deleteRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlPathEqualTo } from '../../../mockApis/wiremock/matchers/url'
import DeleteConditionReasonPage from '../../../pages/conditions/deleteConditionReasonPage'
import DeleteConditionReviewPage from '../../../pages/conditions/deleteConditionReviewPage'
import DeleteConditionConfirmPage from '../../../pages/conditions/deleteConditionConfirmPage'

context('Delete a Condition (History tab)', () => {
  const prisonNumber = 'G6115VJ'
  const conditionReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  const archivedCondition = {
    reference: conditionReference,
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '2023-06-19T09:39:44Z',
    createdAtPrison: 'MDI',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '2023-06-19T09:39:44Z',
    updatedAtPrison: 'MDI',
    source: 'SELF_DECLARED',
    conditionType: {
      code: 'DYSLEXIA',
      description: 'Dyslexia',
      categoryCode: 'NEURODIVERGENCE',
      categoryDescription: 'Neurodivergence',
      areaCode: null,
      areaDescription: null,
      listSequence: 0,
      active: true,
    },
    conditionName: 'Phonological dyslexia',
    conditionDetails: 'John was diagnosed with dyslexia as a child.',
    active: false,
    archiveReason: 'Condition added in error',
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber, conditions: [archivedCondition] })
    cy.task('stubGetCondition', { prisonNumber, conditionReference, condition: archivedCondition })
    cy.task('stubDeleteCondition', { prisonNumber, conditionReference })
  })

  it("should delete a prisoner's history condition via the journey, triggering validation on every screen", () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Conditions', ConditionsPage)
      .clickHistoryTab()
      .clickToDeleteNthArchivedCondition(1)

    // When - submit reason page without selecting to trigger validation error
    Page.verifyOnPage(DeleteConditionReasonPage) //
      .hasNoErrors()
      .submitPageTo(DeleteConditionReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('deleteReason')
      // Select a reason and continue
      .selectReason('ENTERED_IN_ERROR')
      .submitPageTo(DeleteConditionReviewPage)

    // Review page - continue to confirm
    Page.verifyOnPage(DeleteConditionReviewPage) //
      .submitPageTo(DeleteConditionConfirmPage)

    // Confirm page - click "Yes, delete"
    Page.verifyOnPage(DeleteConditionConfirmPage) //
      .submitPageTo(ConditionsPage)

    // Then - verify success banner
    Page.verifyOnPage(ConditionsPage) //
      .hasSuccessMessage('History condition deleted.')

    // And verify the DELETE request was made with the correct query params
    cy.wiremockVerify(
      deleteRequestedFor(
        urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/conditions/${conditionReference}`),
      ),
    )
  })

  it('should not show the Delete link to a user without DELETE_CONDITIONS permission', () => {
    // Given - sign in with a role that doesn't have DELETE_CONDITIONS permission
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    // When
    cy.visit(`/profile/${prisonNumber}/conditions`)

    // Then - no delete button should be visible on the History tab
    Page.verifyOnPage(ConditionsPage) //
      .doesNotHaveDeleteArchivedConditionButton()
  })

  it('should not be able to navigate directly to the history-delete condition page given user does not have the required role', () => {
    // Given - sign in with a role that doesn't have DELETE_CONDITIONS permission
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    // When - visit the history-delete URL directly
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/history-delete/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect back to confirm with an error banner if the API returns an error on confirm', () => {
    // Given - stub DELETE to return 500
    cy.task('stubDeleteCondition500Error', { prisonNumber, conditionReference })

    cy.signIn()

    // Drive journey to the confirm page
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/history-delete/reason`)
    Page.verifyOnPage(DeleteConditionReasonPage) //
      .selectReason('ENTERED_IN_ERROR')
      .submitPageTo(DeleteConditionReviewPage)

    Page.verifyOnPage(DeleteConditionReviewPage) //
      .submitPageTo(DeleteConditionConfirmPage)

    // When - click "Yes, delete" on the confirm page with 500 stub
    const confirmPageBefore = Page.verifyOnPage(DeleteConditionConfirmPage)
    confirmPageBefore.apiErrorBannerIsNotDisplayed()
    confirmPageBefore.submitPageTo(DeleteConditionConfirmPage)

    // Then - stays on confirm with error banner
    Page.verifyOnPage(DeleteConditionConfirmPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('clicking "No, go back to overview" on the confirm screen returns to overview without deleting', () => {
    // Given
    cy.signIn()

    // Drive journey to the confirm page
    cy.visit(`/conditions/${prisonNumber}/${conditionReference}/history-delete/reason`)
    Page.verifyOnPage(DeleteConditionReasonPage) //
      .selectReason('DATA_PROCESSING_OBJECTION')
      .submitPageTo(DeleteConditionReviewPage)

    Page.verifyOnPage(DeleteConditionReviewPage) //
      .submitPageTo(DeleteConditionConfirmPage)

    // When - click "No, go back to overview"
    Page.verifyOnPage(DeleteConditionConfirmPage) //
      .clickNoGoBackToOverview()

    // Then - back on conditions overview, no DELETE request fired
    Page.verifyOnPage(ConditionsPage)

    cy.wiremockVerifyNoInteractions(
      deleteRequestedFor(
        urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/conditions/${conditionReference}`),
      ),
    )
  })
})
