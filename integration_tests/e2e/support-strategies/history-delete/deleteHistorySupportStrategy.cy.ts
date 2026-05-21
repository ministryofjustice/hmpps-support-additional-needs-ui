import DeleteReason from '../../../../server/enums/deleteReason'
import Page from '../../../pages/page'
import SupportStrategiesPage from '../../../pages/profile/supportStrategiesPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import { deleteRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlPathEqualTo } from '../../../mockApis/wiremock/matchers/url'
import DeleteSupportStrategyReasonPage from '../../../pages/support-strategies/deleteSupportStrategyReasonPage'
import DeleteSupportStrategyReviewPage from '../../../pages/support-strategies/deleteSupportStrategyReviewPage'
import DeleteSupportStrategyConfirmPage from '../../../pages/support-strategies/deleteSupportStrategyConfirmPage'

context('Delete a Support Strategy (History tab)', () => {
  const prisonNumber = 'G6115VJ'
  const supportStrategyReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  const archivedSupportStrategy = {
    reference: supportStrategyReference,
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '2023-06-19T09:39:44Z',
    createdAtPrison: 'MDI',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '2023-06-19T09:39:44Z',
    updatedAtPrison: 'MDI',
    detail: 'Use flash cards with John to help him retain facts',
    supportStrategyType: {
      code: 'MEMORY',
      description: 'Memory',
      categoryCode: 'MEMORY',
      categoryDescription: 'Memory',
      areaCode: 'MEMORY',
      areaDescription: 'Memory',
      listSequence: 1,
      active: true,
    },
    active: false,
    archiveReason: 'Support strategy added in error',
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetSupportStrategies', { prisonNumber, supportStrategies: [archivedSupportStrategy] })
    cy.task('stubGetSupportStrategy', {
      prisonNumber,
      supportStrategyReference,
      supportStrategy: archivedSupportStrategy,
    })
    cy.task('stubDeleteSupportStrategy', { prisonNumber, supportStrategyReference })
  })

  it("should delete a prisoner's history support strategy via the journey, triggering validation on every screen", () => {
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Support strategies', SupportStrategiesPage)
      .clickHistoryTab()
      .clickToDeleteNthArchivedSupportStrategy(1)

    Page.verifyOnPage(DeleteSupportStrategyReasonPage) //
      .hasNoErrors()
      .submitPageTo(DeleteSupportStrategyReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('deleteReason')
      .selectReason(DeleteReason.ENTERED_IN_ERROR)
      .submitPageTo(DeleteSupportStrategyReviewPage)

    Page.verifyOnPage(DeleteSupportStrategyReviewPage) //
      .submitPageTo(DeleteSupportStrategyConfirmPage)

    Page.verifyOnPage(DeleteSupportStrategyConfirmPage) //
      .submitPageTo(SupportStrategiesPage)

    Page.verifyOnPage(SupportStrategiesPage) //
      .hasSuccessMessage('History support strategy deleted.')

    cy.wiremockVerify(
      deleteRequestedFor(
        urlPathEqualTo(
          `/support-additional-needs-api/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`,
        ),
      ),
    )
  })

  it('should not show the Delete link to a user without DELETE_SUPPORT_STRATEGIES permission', () => {
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/support-strategies`)

    Page.verifyOnPage(SupportStrategiesPage) //
      .doesNotHaveDeleteArchivedSupportStrategyButton()
  })

  it('should not be able to navigate directly to the history-delete support strategy page given user does not have the required role', () => {
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/history-delete/reason`, {
      failOnStatusCode: false,
    })

    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect back to confirm with an error banner if the API returns an error on confirm', () => {
    cy.task('stubDeleteSupportStrategy500Error', { prisonNumber, supportStrategyReference })

    cy.signIn()

    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/history-delete/reason`)
    Page.verifyOnPage(DeleteSupportStrategyReasonPage) //
      .selectReason(DeleteReason.ENTERED_IN_ERROR)
      .submitPageTo(DeleteSupportStrategyReviewPage)

    Page.verifyOnPage(DeleteSupportStrategyReviewPage) //
      .submitPageTo(DeleteSupportStrategyConfirmPage)

    const confirmPageBefore = Page.verifyOnPage(DeleteSupportStrategyConfirmPage)
    confirmPageBefore.apiErrorBannerIsNotDisplayed()
    confirmPageBefore.submitPageTo(DeleteSupportStrategyConfirmPage)

    Page.verifyOnPage(DeleteSupportStrategyConfirmPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('clicking "No, go back to overview" on the confirm screen returns to overview without deleting', () => {
    cy.signIn()

    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/history-delete/reason`)
    Page.verifyOnPage(DeleteSupportStrategyReasonPage) //
      .selectReason(DeleteReason.DATA_PROCESSING_OBJECTION)
      .submitPageTo(DeleteSupportStrategyReviewPage)

    Page.verifyOnPage(DeleteSupportStrategyReviewPage) //
      .submitPageTo(DeleteSupportStrategyConfirmPage)

    Page.verifyOnPage(DeleteSupportStrategyConfirmPage) //
      .clickNoGoBackToOverview()

    Page.verifyOnPage(SupportStrategiesPage)

    cy.wiremockVerifyNoInteractions(
      deleteRequestedFor(
        urlPathEqualTo(
          `/support-additional-needs-api/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`,
        ),
      ),
    )
  })
})
