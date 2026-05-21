import DeleteReason from '../../../../server/enums/deleteReason'
import Page from '../../../pages/page'
import StrengthsPage from '../../../pages/profile/strengthsPage'
import ChallengesPage from '../../../pages/profile/challengesPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import DeleteAlnScreenerReasonPage from '../../../pages/additional-learning-needs-screener/deleteAlnScreenerReasonPage'
import DeleteAlnScreenerReviewPage from '../../../pages/additional-learning-needs-screener/deleteAlnScreenerReviewPage'
import DeleteAlnScreenerConfirmPage from '../../../pages/additional-learning-needs-screener/deleteAlnScreenerConfirmPage'
import { deleteRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlPathEqualTo } from '../../../mockApis/wiremock/matchers/url'

context('Delete an ALN Screener', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetAlnScreeners', { prisonNumber })
    cy.task('stubDeleteAlnScreener', prisonNumber)
  })

  it('should delete the prisoners ALN screener via the journey, triggering validation on the reason page', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Strengths', StrengthsPage)
      .clickToDeleteAlnScreener()

    // Submit reason page without selecting -> validation error
    Page.verifyOnPage(DeleteAlnScreenerReasonPage) //
      .hasNoErrors()
      .submitPageTo(DeleteAlnScreenerReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('deleteReason')
      .selectReason(DeleteReason.ENTERED_IN_ERROR)
      .submitPageTo(DeleteAlnScreenerReviewPage)

    Page.verifyOnPage(DeleteAlnScreenerReviewPage) //
      .submitPageTo(DeleteAlnScreenerConfirmPage)

    Page.verifyOnPage(DeleteAlnScreenerConfirmPage) //
      .submitPageTo(StrengthsPage)

    Page.verifyOnPage(StrengthsPage) //
      .hasSuccessMessage('Screener results deleted.')

    cy.wiremockVerify(
      deleteRequestedFor(urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/aln-screener`)),
    )
  })

  it('should redirect back to the Challenges overview when the journey was entered from Challenges', () => {
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Challenges', ChallengesPage)
      .clickToDeleteAlnScreener()

    Page.verifyOnPage(DeleteAlnScreenerReasonPage) //
      .selectReason(DeleteReason.DATA_PROCESSING_OBJECTION)
      .submitPageTo(DeleteAlnScreenerReviewPage)

    Page.verifyOnPage(DeleteAlnScreenerReviewPage) //
      .submitPageTo(DeleteAlnScreenerConfirmPage)

    Page.verifyOnPage(DeleteAlnScreenerConfirmPage) //
      .submitPageTo(ChallengesPage)

    Page.verifyOnPage(ChallengesPage) //
      .hasSuccessMessage('Screener results deleted.')

    cy.wiremockVerify(
      deleteRequestedFor(urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/aln-screener`)),
    )
  })

  it('should not show the Delete link on either overview to a user without DELETE_ALN_SCREENER permission', () => {
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/strengths`)
    Page.verifyOnPage(StrengthsPage) //
      .doesNotHaveDeleteAlnScreenerButton()

    cy.visit(`/profile/${prisonNumber}/challenges`)
    Page.verifyOnPage(ChallengesPage) //
      .doesNotHaveDeleteAlnScreenerButton()
  })

  it('should redirect to /authError when a user without DELETE_ALN_SCREENER attempts the journey URL directly', () => {
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    cy.visit(`/aln-screener/${prisonNumber}/delete/reason`, { failOnStatusCode: false })

    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should bail back to the confirm page if the API returns an error on confirm', () => {
    cy.task('stubDeleteAlnScreener500Error', prisonNumber)
    cy.signIn()

    cy.visit(`/aln-screener/${prisonNumber}/delete/reason`)
    Page.verifyOnPage(DeleteAlnScreenerReasonPage) //
      .selectReason(DeleteReason.ENTERED_IN_ERROR)
      .submitPageTo(DeleteAlnScreenerReviewPage)

    Page.verifyOnPage(DeleteAlnScreenerReviewPage) //
      .submitPageTo(DeleteAlnScreenerConfirmPage)

    const confirmPageBefore = Page.verifyOnPage(DeleteAlnScreenerConfirmPage)
    confirmPageBefore.apiErrorBannerIsNotDisplayed()
    confirmPageBefore.submitPageTo(DeleteAlnScreenerConfirmPage)

    Page.verifyOnPage(DeleteAlnScreenerConfirmPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('clicking "No, go back to overview" returns to the entry-point overview without deleting', () => {
    cy.signIn()

    cy.visit(`/aln-screener/${prisonNumber}/delete/reason`)
    Page.verifyOnPage(DeleteAlnScreenerReasonPage) //
      .selectReason(DeleteReason.DATA_PROCESSING_OBJECTION)
      .submitPageTo(DeleteAlnScreenerReviewPage)

    Page.verifyOnPage(DeleteAlnScreenerReviewPage) //
      .submitPageTo(DeleteAlnScreenerConfirmPage)

    Page.verifyOnPage(DeleteAlnScreenerConfirmPage) //
      .clickNoGoBackToOverview()

    // Direct entry has no Referer matching a known overview so we fall back to the profile overview
    Page.verifyOnPage(OverviewPage)

    cy.wiremockVerifyNoInteractions(
      deleteRequestedFor(urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/aln-screener`)),
    )
  })

  it('should 404 when the prisoner has no current ALN screener', () => {
    cy.task('stubGetAlnScreenersEmpty', prisonNumber)
    cy.signIn()

    cy.visit(`/aln-screener/${prisonNumber}/delete/reason`, { failOnStatusCode: false })

    cy.get('h1').should('contain.text', 'Page not found')
  })
})
