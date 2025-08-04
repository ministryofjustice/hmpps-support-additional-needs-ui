/**
 * Cypress scenarios for the Profile Overview page.
 */

import Page from '../../pages/page'
import ConditionsPage from '../../pages/profile/conditionsPage'

context('Profile Conditions Page', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should render the conditions page given the prisoner has no Conditions', () => {
    // Given
    cy.task('stubGetConditions', { prisonNumber, conditions: [] })

    // When
    cy.visit(`/profile/${prisonNumber}/conditions`)

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .hasNoActiveConditions()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the conditions page given the API to get Conditions returns an error', () => {
    // Given
    cy.task('stubGetConditions500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/conditions`)

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .apiErrorBannerIsDisplayed()
  })
})
