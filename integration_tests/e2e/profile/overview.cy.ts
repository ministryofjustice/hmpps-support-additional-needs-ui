/**
 * Cypress scenarios for the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overviewPage'
import Page from '../../pages/page'
import Error404Page from '../../pages/error404'
import PlanCreationScheduleStatus from '../../../server/enums/planCreationScheduleStatus'
import SupportStrategiesPage from '../../pages/profile/supportStrategiesPage'
import EducationSupportPlanPage from '../../pages/profile/educationSupportPlanPage'
import ConditionsPage from '../../pages/profile/conditionsPage'
import StrengthsPage from '../../pages/profile/strengthsPage'
import ChallengesPage from '../../pages/profile/challengesPage'

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
      .actionsCardContainsEducationSupportPlanActions()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display overview page given prisoner already has an Education Support Plan', () => {
    // Given
    const prisonNumber = 'H4115SD'
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', {
      prisonNumber,
      status: PlanCreationScheduleStatus.COMPLETED,
    })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .actionsCardIsNotPresent()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display overview page given retrieving the prisoners plan creation schedule returns an error', () => {
    // Given
    const prisonNumber = 'H4115SD'
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules500Error', { prisonNumber })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .actionsCardIsNotPresent()
      .apiErrorBannerIsDisplayed()
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

  it('should be able to use the tab bar to navigate between the different profile pages', () => {
    // Given
    const prisonNumber = 'H4115SD'
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })

    cy.visit(`/profile/${prisonNumber}/overview`)

    // When
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Support strategies', SupportStrategiesPage)
      .activeTabIs('Support strategies')
      .selectTab('Education support plan', EducationSupportPlanPage)
      .activeTabIs('Education support plan')
      .selectTab('Conditions', ConditionsPage)
      .activeTabIs('Conditions')
      .selectTab('Strengths', StrengthsPage)
      .activeTabIs('Strengths')
      .selectTab('Challenges', ChallengesPage)
      .activeTabIs('Challenges')
      .selectTab('Overview', OverviewPage)

    // Then
    Page.verifyOnPage(OverviewPage)
  })
})
