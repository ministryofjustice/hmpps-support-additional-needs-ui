/**
 * Cypress scenarios for the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overviewPage'
import Page from '../../pages/page'
import Error404Page from '../../pages/error404'
import SupportStrategiesPage from '../../pages/profile/supportStrategiesPage'
import EducationSupportPlanPage from '../../pages/profile/educationSupportPlanPage'
import ConditionsPage from '../../pages/profile/conditionsPage'
import StrengthsPage from '../../pages/profile/strengthsPage'
import ChallengesPage from '../../pages/profile/challengesPage'
import aPlanActionStatus from '../../../server/testsupport/planActionStatusTestDataBuilder'

context('Profile Overview Page', () => {
  const prisonNumber = 'H4115SD'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetConditions', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetCuriousV2Assessments', { prisonNumber })
    cy.task('stubGetEducationSupportPlan', prisonNumber)
    cy.task('stubGetPlanActionStatus', {
      prisonNumber,
      planActionStatus: aPlanActionStatus({
        status: 'PLAN_DUE',
        reviewDeadlineDate: null,
        exemptionReason: null,
        exemptionDetail: null,
        exemptionRecordedAt: null,
        exemptionRecordedBy: null,
      }),
    })
  })

  it('should be able to navigate directly to the profile overview page', () => {
    // Given

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasAlnAssessmentsRecorded()
      .hasLddAssessmentsRecorded()
      .hasConditionsRecorded('Acquired brain injury')
      .hasStrengthsRecorded('Numeracy skills')
      .hasNoSupportRecommendationsRecorded()
      .actionsCardContainsEducationSupportPlanActions()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display overview page given retrieving the prisoners plan action status returns an error', () => {
    // Given
    cy.task('stubGetPlanActionStatus500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given requesting the overview page for a prisoner that does not exist', () => {
    // Given
    const nonExistentPrisoner = 'A9999ZZ'
    cy.task('stubPrisonerById404Error', nonExistentPrisoner)

    // When
    cy.visit(`/profile/${nonExistentPrisoner}/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should display 404 page given requesting the overview page for a prisoner not in the user caseloads', () => {
    // Given
    const prisonerNotInCaseload = 'A9404DY' // Prisoner is in Pentonville (PVI) which is not one of the user's caseloads
    cy.task('getPrisonerById', prisonerNotInCaseload)

    // When
    cy.visit(`/profile/${prisonerNotInCaseload}/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should be able to use the tab bar to navigate between the different profile pages', () => {
    // Given
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
