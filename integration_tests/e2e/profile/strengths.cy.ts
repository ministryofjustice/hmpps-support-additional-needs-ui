/**
 * Cypress scenarios for the Profile Strengths page.
 */

import Page from '../../pages/page'
import StrengthsPage from '../../pages/profile/strengthsPage'

context('Profile Strengths Page', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should render the strengths page given the prisoner has no manually recorded Strengths or Strengths on an ALN Screener', () => {
    // Given
    cy.task('stubGetStrengths404Error', { prisonNumber })
    cy.task('stubGetAlnScreeners404Error', { prisonNumber })

    // When
    cy.visit(`/profile/${prisonNumber}/strengths`)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .hasNoActiveStrengths()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the strengths page given the API to get Strengths returns an error', () => {
    // Given
    cy.task('stubGetStrengths500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/strengths`)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .apiErrorBannerIsDisplayed()
  })
})
