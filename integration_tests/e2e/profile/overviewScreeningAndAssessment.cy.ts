/**
 * Cypress scenarios for the Screening and Assessment section of the Profile Overview page.
 */

import OverviewPage from '../../pages/profile/overviewPage'
import Page from '../../pages/page'
import {
  aLearnerLddInfoExternalV1DTO,
  anAlnLearnerAssessmentsDTO,
} from '../../../server/testsupport/curiousAssessmentsTestDataBuilder'

context('Profile Overview Page - Screening and Assessment section', () => {
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

  it('should display overview page given prisoner has only LDD assessments', () => {
    // Given
    cy.task('stubGetCuriousV2Assessments', {
      prisonNumber,
      lddAssessments: [aLearnerLddInfoExternalV1DTO()],
      alnAssessments: [anAlnLearnerAssessmentsDTO()],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasLddAssessmentsRecorded()
      .hasAlnAssessmentsRecorded()
  })

  it('should display overview page given prisoner has only LDD assessments', () => {
    // Given
    cy.task('stubGetCuriousV2Assessments', {
      prisonNumber,
      lddAssessments: [aLearnerLddInfoExternalV1DTO()],
      alnAssessments: [],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasLddAssessmentsRecorded()
      .hasNoAlnAssessmentsRecorded()
  })

  it('should display overview page given prisoner has only ALN assessments', () => {
    // Given
    cy.task('stubGetCuriousV2Assessments', {
      prisonNumber,
      lddAssessments: [],
      alnAssessments: [anAlnLearnerAssessmentsDTO()],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasAlnAssessmentsRecorded()
      .hasNoLddAssessmentsRecorded()
  })

  it('should display overview page given prisoner has no Curious assessments', () => {
    // Given
    cy.task('stubGetCuriousV2Assessments', { prisonNumber, lddAssessments: [], alnAssessments: [] })

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasNoScreeningAndAssessmentsRecorded()
  })

  it('should display overview page given retrieving the prisoners Curious assessments returns an error', () => {
    // Given
    cy.task('stubGetCuriousV2Assessments500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/overview`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasCuriousScreenersUnavailableMessage()
      .apiErrorBannerIsDisplayed()
  })
})
