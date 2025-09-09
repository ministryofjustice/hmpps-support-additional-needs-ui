/**
 * Cypress scenarios for the Profile Support Strategies page.
 */

import Page from '../../pages/page'
import { aValidSupportStrategyResponse } from '../../../server/testsupport/supportStrategyResponseTestDataBuilder'
import SupportStrategiesPage from '../../pages/profile/supportStrategiesPage'
import SupportStrategyType from '../../../server/enums/supportStrategyType'

context('Profile Support Strategies Page', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should render the support strategies page given the prisoner given a user has one recorded', () => {
    // Given
    cy.task('stubGetSupportStrategies', {
      prisonNumber,
      supportStrategies: [
        aValidSupportStrategyResponse({
          supportStrategyType: 'MEMORY',
          supportStrategyCategory: 'MEMORY',
          detail: 'Support to be given via structured reading programme',
        }),
        aValidSupportStrategyResponse({
          supportStrategyType: 'SENSORY',
          supportStrategyCategory: 'SENSORY',
          detail: 'Have some nice soft things',
        }),
      ],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/support-strategies`)

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .hasSupportStrategySummaryCard(SupportStrategyType.MEMORY)
      .hasSupportStrategySummaryCard(SupportStrategyType.SENSORY)
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the support strategies page given the prisoner has none recorded', () => {
    // Given
    cy.task('stubGetSupportStrategies', { prisonNumber, supportStrategies: [] })

    // When
    cy.visit(`/profile/${prisonNumber}/support-strategies`)

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .hasNoActiveSupportStrategies()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the support strategies page given the API to get Support Strategies returns an error', () => {
    // Given
    cy.task('stubGetSupportStrategies500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/support-strategies`)

    // Then
    Page.verifyOnPage(SupportStrategiesPage) //
      .apiErrorBannerIsDisplayed()
  })
})
