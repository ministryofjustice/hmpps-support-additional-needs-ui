import Page from '../../../pages/page'
import StrengthsPage from '../../../pages/profile/strengthsPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import { deleteRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlPathEqualTo } from '../../../mockApis/wiremock/matchers/url'
import DeleteStrengthReasonPage from '../../../pages/strengths/deleteStrengthReasonPage'
import DeleteStrengthReviewPage from '../../../pages/strengths/deleteStrengthReviewPage'
import DeleteStrengthConfirmPage from '../../../pages/strengths/deleteStrengthConfirmPage'

context('Delete a Strength (Current tab)', () => {
  const prisonNumber = 'G6115VJ'
  const strengthReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to delete strengths
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber, strengthReference })
    cy.task('stubGetStrength', { prisonNumber, strengthReference })
    cy.task('stubDeleteStrength', { prisonNumber, strengthReference })
  })

  it("should delete a prisoner's strength via the journey, triggering validation on every screen", () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Strengths', StrengthsPage)
      .clickToDeleteNthNonAlnStrength(1)

    // When - submit reason page without selecting to trigger validation error
    Page.verifyOnPage(DeleteStrengthReasonPage) //
      .hasNoErrors()
      .submitPageTo(DeleteStrengthReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('deleteReason')
      // Select a reason and continue
      .selectReason('ENTERED_IN_ERROR')
      .submitPageTo(DeleteStrengthReviewPage)

    // Review page - continue to confirm
    Page.verifyOnPage(DeleteStrengthReviewPage) //
      .submitPageTo(DeleteStrengthConfirmPage)

    // Confirm page - click "Yes, delete"
    Page.verifyOnPage(DeleteStrengthConfirmPage) //
      .submitPageTo(StrengthsPage)

    // Then - verify success banner
    Page.verifyOnPage(StrengthsPage) //
      .hasSuccessMessage('Strength deleted.')

    // And verify the DELETE request was made with the correct query params
    cy.wiremockVerify(
      deleteRequestedFor(
        urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/strengths/${strengthReference}`),
      ),
    )
  })

  it('should not show the Delete link to a user without DELETE_STRENGTHS permission', () => {
    // Given - sign in with a role that doesn't have DELETE_STRENGTHS permission
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    // When
    cy.visit(`/profile/${prisonNumber}/strengths`)

    // Then - no delete button should be visible
    Page.verifyOnPage(StrengthsPage) //
      .doesNotHaveDeleteStrengthButton()
  })

  it('should not be able to navigate directly to the delete strength page given user does not have the required role', () => {
    // Given - sign in with a role that doesn't have DELETE_STRENGTHS permission
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    // When - visit the delete URL directly
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/delete/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect back to confirm with an error banner if the API returns an error on confirm', () => {
    // Given - stub DELETE to return 500
    cy.task('stubDeleteStrength500Error', { prisonNumber, strengthReference })

    cy.signIn()

    // Drive journey to the confirm page
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/delete/reason`)
    Page.verifyOnPage(DeleteStrengthReasonPage) //
      .selectReason('ENTERED_IN_ERROR')
      .submitPageTo(DeleteStrengthReviewPage)

    Page.verifyOnPage(DeleteStrengthReviewPage) //
      .submitPageTo(DeleteStrengthConfirmPage)

    // When - click "Yes, delete" on the confirm page with 500 stub
    const confirmPageBefore = Page.verifyOnPage(DeleteStrengthConfirmPage)
    confirmPageBefore.apiErrorBannerIsNotDisplayed()
    confirmPageBefore.submitPageTo(DeleteStrengthConfirmPage)

    // Then - stays on confirm with error banner
    Page.verifyOnPage(DeleteStrengthConfirmPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('clicking "No, go back to overview" on the confirm screen returns to overview without deleting', () => {
    // Given
    cy.signIn()

    // Drive journey to the confirm page
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/delete/reason`)
    Page.verifyOnPage(DeleteStrengthReasonPage) //
      .selectReason('DATA_PROCESSING_OBJECTION')
      .submitPageTo(DeleteStrengthReviewPage)

    Page.verifyOnPage(DeleteStrengthReviewPage) //
      .submitPageTo(DeleteStrengthConfirmPage)

    // When - click "No, go back to overview"
    Page.verifyOnPage(DeleteStrengthConfirmPage) //
      .clickNoGoBackToOverview()

    // Then - back on strengths overview, no DELETE request fired
    Page.verifyOnPage(StrengthsPage)

    cy.wiremockVerifyNoInteractions(
      deleteRequestedFor(
        urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/strengths/${strengthReference}`),
      ),
    )
  })
})
