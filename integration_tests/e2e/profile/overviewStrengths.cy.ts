/**
 * Cypress scenarios for the Strengths section of the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overviewPage'
import Page from '../../pages/page'

context('Profile Overview Page - Strengths section', () => {
  const prisonNumber = 'H4115SD'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetCuriousV2Assessments', { prisonNumber })
  })

  it('should display overview page given retrieving the prisoners Strengths returns an error', () => {
    // Given
    cy.task('stubGetStrengths500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasStrengthsUnavailableMessage()
      .apiErrorBannerIsDisplayed()
  })

  it('should display overview page given retrieving the prisoners ALN Screeners returns an error', () => {
    // Given
    cy.task('stubGetAlnScreeners500Error', prisonNumber) // Both the prisoners Strengths and ALN Screeners are required to display the Strengths section

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasStrengthsUnavailableMessage()
      .apiErrorBannerIsDisplayed()
  })
})
