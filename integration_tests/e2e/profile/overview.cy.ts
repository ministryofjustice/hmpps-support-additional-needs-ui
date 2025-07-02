/**
 * Cypress scenarios for the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overview/overviewPage'
import Page from '../../pages/page'
import Error404Page from '../../pages/error404'

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
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasNoAdditionalNeedsRecorded()
      .hasNoConditionsRecorded()
      .hasNoStrengthsRecorded()
      .hasNoSupportRecommendationsRecorded()
  })

  it('should display 404 page given requesting the overview page for a prisoner that does not exist', () => {
    // Given
    const prisonNumber = 'A9999ZZ'
    cy.task('stubPrisonerById404Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should display 404 page given requesting the overview page for a prisoner not in the user caseloads', () => {
    // Given
    const prisonNumber = 'A9404DY' // Prisoner is in Pentonville (PVI) which is not one of the user's caseloads
    cy.task('getPrisonerById', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
