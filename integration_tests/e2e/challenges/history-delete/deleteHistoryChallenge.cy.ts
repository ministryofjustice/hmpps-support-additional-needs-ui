import Page from '../../../pages/page'
import ChallengesPage from '../../../pages/profile/challengesPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import OverviewPage from '../../../pages/profile/overviewPage'
import { deleteRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlPathEqualTo } from '../../../mockApis/wiremock/matchers/url'
import DeleteChallengeReasonPage from '../../../pages/challenges/deleteChallengeReasonPage'
import DeleteChallengeReviewPage from '../../../pages/challenges/deleteChallengeReviewPage'
import DeleteChallengeConfirmPage from '../../../pages/challenges/deleteChallengeConfirmPage'

context('Delete a Challenge (History tab)', () => {
  const prisonNumber = 'G6115VJ'
  const challengeReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  const archivedChallenge = {
    reference: challengeReference,
    prisonNumber,
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '2023-06-19T09:39:44Z',
    createdAtPrison: 'MDI',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '2023-06-19T09:39:44Z',
    updatedAtPrison: 'MDI',
    symptoms: 'John is not good at long division',
    howIdentified: ['EDUCATION_SKILLS_WORK'],
    challengeType: {
      code: 'NUMERACY_SKILLS_DEFAULT',
      description: 'Numeracy Skills',
      categoryCode: 'NUMERACY_SKILLS',
      categoryDescription: 'Numeracy Skills',
      areaCode: 'COGNITION_LEARNING',
      areaDescription: 'Cognition & Learning',
      listSequence: 0,
      active: true,
    },
    fromALNScreener: false,
    active: false,
    archiveReason: 'Challenge added in error',
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber, challenges: [archivedChallenge] })
    cy.task('stubGetChallenge', { prisonNumber, challengeReference, challenge: archivedChallenge })
    cy.task('stubDeleteChallenge', { prisonNumber, challengeReference })
  })

  it("should delete a prisoner's history challenge via the journey, triggering validation on every screen", () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Challenges', ChallengesPage)
      .clickHistoryTab()
      .clickToDeleteNthArchivedChallenge(1)

    // When - submit reason page without selecting to trigger validation error
    Page.verifyOnPage(DeleteChallengeReasonPage) //
      .hasNoErrors()
      .submitPageTo(DeleteChallengeReasonPage)
      .hasErrorCount(1)
      .hasFieldInError('deleteReason')
      // Select a reason and continue
      .selectReason('ENTERED_IN_ERROR')
      .submitPageTo(DeleteChallengeReviewPage)

    // Review page - continue to confirm
    Page.verifyOnPage(DeleteChallengeReviewPage) //
      .submitPageTo(DeleteChallengeConfirmPage)

    // Confirm page - click "Yes, delete"
    Page.verifyOnPage(DeleteChallengeConfirmPage) //
      .submitPageTo(ChallengesPage)

    // Then - verify success banner
    Page.verifyOnPage(ChallengesPage) //
      .hasSuccessMessage('History challenge deleted.')

    // And verify the DELETE request was made with the correct query params
    cy.wiremockVerify(
      deleteRequestedFor(
        urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/challenges/${challengeReference}`),
      ),
    )
  })

  it('should not show the Delete link to a user without DELETE_CHALLENGES permission', () => {
    // Given - sign in with a role that doesn't have DELETE_CHALLENGES permission
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    // When
    cy.visit(`/profile/${prisonNumber}/challenges`)

    // Then - no delete button should be visible on the History tab
    Page.verifyOnPage(ChallengesPage) //
      .doesNotHaveDeleteArchivedChallengeButton()
  })

  it('should not be able to navigate directly to the history-delete challenge page given user does not have the required role', () => {
    // Given - sign in with a role that doesn't have DELETE_CHALLENGES permission
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] })
    cy.signIn()

    // When - visit the history-delete URL directly
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/history-delete/reason`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect back to confirm with an error banner if the API returns an error on confirm', () => {
    // Given - stub DELETE to return 500
    cy.task('stubDeleteChallenge500Error', { prisonNumber, challengeReference })

    cy.signIn()

    // Drive journey to the confirm page
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/history-delete/reason`)
    Page.verifyOnPage(DeleteChallengeReasonPage) //
      .selectReason('ENTERED_IN_ERROR')
      .submitPageTo(DeleteChallengeReviewPage)

    Page.verifyOnPage(DeleteChallengeReviewPage) //
      .submitPageTo(DeleteChallengeConfirmPage)

    // When - click "Yes, delete" on the confirm page with 500 stub
    const confirmPageBefore = Page.verifyOnPage(DeleteChallengeConfirmPage)
    confirmPageBefore.apiErrorBannerIsNotDisplayed()
    confirmPageBefore.submitPageTo(DeleteChallengeConfirmPage)

    // Then - stays on confirm with error banner
    Page.verifyOnPage(DeleteChallengeConfirmPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('clicking "No, go back to overview" on the confirm screen returns to overview without deleting', () => {
    // Given
    cy.signIn()

    // Drive journey to the confirm page
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/history-delete/reason`)
    Page.verifyOnPage(DeleteChallengeReasonPage) //
      .selectReason('DATA_PROCESSING_OBJECTION')
      .submitPageTo(DeleteChallengeReviewPage)

    Page.verifyOnPage(DeleteChallengeReviewPage) //
      .submitPageTo(DeleteChallengeConfirmPage)

    // When - click "No, go back to overview"
    Page.verifyOnPage(DeleteChallengeConfirmPage) //
      .clickNoGoBackToOverview()

    // Then - back on challenges overview, no DELETE request fired
    Page.verifyOnPage(ChallengesPage)

    cy.wiremockVerifyNoInteractions(
      deleteRequestedFor(
        urlPathEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/challenges/${challengeReference}`),
      ),
    )
  })
})
