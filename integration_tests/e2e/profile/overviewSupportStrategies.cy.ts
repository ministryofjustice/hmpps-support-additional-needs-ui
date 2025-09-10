/**
 * Cypress scenarios for the Support Strategies section of the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overviewPage'
import Page from '../../pages/page'

context('Profile Overview Page - Support Strategies section', () => {
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
    cy.task('stubGetSupportStrategies', { prisonNumber, supportStrategies: [] })
  })

  it('should display overview page given the prisoner has no support strategies recorded', () => {
    // Given
    cy.task('stubGetSupportStrategies', { prisonNumber, supportStrategies: [] })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasNoSupportStrategiesRecorded()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display overview page given retrieving the prisoners support strategies returns an error', () => {
    // Given
    cy.task('stubGetSupportStrategies500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSupportStrategiesUnavailableMessage()
      .apiErrorBannerIsDisplayed()
  })
})
