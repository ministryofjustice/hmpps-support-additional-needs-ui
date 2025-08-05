/**
 * Cypress scenarios for the Profile Conditions page.
 */

import Page from '../../pages/page'
import ConditionsPage from '../../pages/profile/conditionsPage'
import ConditionType from '../../../server/enums/conditionType'
import ConditionSource from '../../../server/enums/conditionSource'
import { aValidConditionResponse } from '../../../server/testsupport/conditionResponseTestDataBuilder'

context('Profile Conditions Page', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should render the conditions page given the prisoner has Conditions', () => {
    // Given
    cy.task('stubGetConditions', {
      prisonNumber,
      conditions: [
        aValidConditionResponse({
          conditionTypeCode: ConditionType.ADHD,
          conditionName: null,
          conditionDetails: 'ADHD diagnosed at childhood',
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
        }),
        aValidConditionResponse({
          conditionTypeCode: ConditionType.DYSLEXIA,
          conditionName: null,
          conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
          source: ConditionSource.SELF_DECLARED,
        }),
        aValidConditionResponse({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: 'Red-green colour blindness. Formally diagnosed by an optometrist.',
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
        }),
      ],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/conditions`)

    // Then
    Page.verifyOnPage(ConditionsPage) //
      .hasDiagnosedConditions(ConditionType.ADHD, ConditionType.VISUAL_IMPAIR)
      .hasSelfDeclaredConditions(ConditionType.DYSLEXIA)
      .apiErrorBannerIsNotDisplayed()
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
