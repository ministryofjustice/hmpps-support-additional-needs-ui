/**
 * Cypress scenarios for the Profile Education Support Plan page.
 */

import { addDays, format, startOfToday, subDays } from 'date-fns'
import Page from '../../pages/page'
import EducationSupportPlanPage from '../../pages/profile/educationSupportPlanPage'
import aPlanActionStatus from '../../../server/testsupport/planActionStatusTestDataBuilder'

context('Profile Education Support Plan Page', () => {
  const prisonNumber = 'A00001A'

  const today = startOfToday()
  const lastWeek = subDays(today, 7)
  const nextWeek = addDays(today, 7)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should render the education support plan page given the prisoner has an Education Support Plan', () => {
    // Given
    cy.task('stubGetEducationSupportPlan', prisonNumber)
    cy.task('stubGetPlanActionStatus', {
      prisonNumber,
      planActionStatus: aPlanActionStatus({
        status: 'REVIEW_DUE',
        reviewDeadlineDate: format(nextWeek, 'yyyy-MM-dd'),
      }),
    })

    // When
    cy.visit(`/profile/${prisonNumber}/education-support-plan`)

    // Then
    Page.verifyOnPage(EducationSupportPlanPage) //
      .hasAdjustmentsToTeachingEnvironment('Use simpler examples to help students understand concepts')
      .hasSpecificTeacherKnowledgeRequired('Teacher with BSL proficiency required')
      .hasExamAccessArrangements('Escort to the exam room 10 minutes before everyone else')
      .hasLearningNeedsSupport('Chris will need text reading to him as he cannot read himself')
      .hasOtherDetails('Chris responded well to the discussion about his learning needs and education plan')
      .doesNotHaveCurrentEhcp()
      .hasPrisonersViewOnSupportNeeded('Chris is feeling positive and is keen to learn')

      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the education support plan page given the prisoner has no plan yet and the schedule is overdue', () => {
    // Given
    cy.task('stubGetEducationSupportPlan404Error', prisonNumber)
    cy.task('stubGetPlanActionStatus', {
      prisonNumber,
      planActionStatus: aPlanActionStatus({
        status: 'PLAN_OVERDUE',
        planCreationDeadlineDate: format(lastWeek, 'yyyy-MM-dd'),
      }),
    })

    // When
    cy.visit(`/profile/${prisonNumber}/education-support-plan`)

    // Then
    Page.verifyOnPage(EducationSupportPlanPage) //
      .hasNoEducationSupportPlanDisplayed()
      .hasLinkToCreateEducationSupportPlanBy(format(lastWeek, 'd MMM yyyy'))
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the education support plan page given the API to get the Education Support Plan returns an error', () => {
    // Given
    cy.task('stubGetEducationSupportPlan500Error', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })

    // When
    cy.visit(`/profile/${prisonNumber}/education-support-plan`)

    // Then
    Page.verifyOnPage(EducationSupportPlanPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should render the education support plan page given the API to get the Education Support Plan Lifecycle Status returns an error', () => {
    // Given
    cy.task('stubGetEducationSupportPlan', prisonNumber)
    cy.task('stubGetPlanActionStatus500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/education-support-plan`)

    // Then
    Page.verifyOnPage(EducationSupportPlanPage) //
      .apiErrorBannerIsDisplayed()
  })
})
