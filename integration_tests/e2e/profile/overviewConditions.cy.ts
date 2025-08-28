/**
 * Cypress scenarios for the Conditions section of the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overviewPage'
import Page from '../../pages/page'

context('Profile Overview Page - Conditions section', () => {
  const prisonNumber = 'H4115SD'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetCuriousV2Assessments', { prisonNumber })
  })

  it('should display overview page given the prisoner has no Conditions recorded', () => {
    // Given
    cy.task('stubGetConditions404Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasNoConditionsRecorded()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display overview page given retrieving the prisoners Conditions returns an error', () => {
    // Given
    cy.task('stubGetConditions500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasConditionsUnavailableMessage()
      .apiErrorBannerIsDisplayed()
  })
})
