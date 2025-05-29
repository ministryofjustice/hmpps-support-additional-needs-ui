/**
 * Cypress scenarios for the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overview/overviewPage'
import Page from '../../pages/page'

context('Profile Overview Page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  it('should be able to navigate directly to the profile overview page', () => {
    // Given
    const prisonNumber = 'H4115SD'
    cy.task('getPrisonerById', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasNoAdditionalNeedsRecorded()
      .hasNoConditionsRecorded()
      .hasNoStrengthsRecorded()
      .hasNoSupportRecommendationsRecorded()
  })
})
