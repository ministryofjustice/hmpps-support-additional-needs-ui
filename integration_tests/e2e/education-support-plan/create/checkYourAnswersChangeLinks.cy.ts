/**
 * Cypress tests that test the Change links on the Check Your Answers page when creating an Education Support Plan
 */
import { addMonths, format, startOfToday, subDays } from 'date-fns'
import CheckYourAnswersPage from '../../../pages/education-support-plan/checkYourAnswersPage'
import Page from '../../../pages/page'
import PlanCreatedByValue from '../../../../server/enums/planCreatedByValue'

context(`Change links on the Check Your Answers page when creating an Education Support Plan`, () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should support all Change links on the Check Your Answers page when creating an Education Support Plan', () => {
    // Given
    const reviewDate = addMonths(startOfToday(), 3)
    const updatedReviewDate = subDays(reviewDate, 5)

    cy.createEducationSupportPlanToArriveOnCheckYourAnswers({ prisonNumber, reviewDate })

    // When
    Page.verifyOnPage(CheckYourAnswersPage)
      // check and update EHCP
      .doesNotHaveCurrentEducationHealthCarePlan()
      .clickEducationHealthCarePlanChangeLink()
      .selectHasCurrentEhcp()
      .submitPageTo(CheckYourAnswersPage)
      .hasCurrentEducationHealthCarePlan()

      // check and update Review Date
      .hasReviewDate(format(reviewDate, 'd MMMM yyyy'))
      .clickReviewDateChangeLink()
      .setReviewDate(format(updatedReviewDate, 'd/M/yyyy'))
      .submitPageTo(CheckYourAnswersPage)
      .hasReviewDate(format(updatedReviewDate, 'd MMMM yyyy'))

      // check and update LNSP classroom support
      .doesNotRequireLearningNeedsSupportPractitionerSupport()
      .clickLearningNeedsSupportPractitionerSupportChangeLink()
      .selectLnspSupportRequired()
      .enterDetails('Chris will need text reading to him as he cannot read himself')
      .submitPageTo(CheckYourAnswersPage)
      .requiresLearningNeedsSupportPractitionerSupport('Chris will need text reading to him as he cannot read himself')

      // check and updated exam access requirements
      .doesNotRequireExamArrangements()
      .clickExamArrangementsChangeLink()
      .selectExamArrangementsRequired()
      .enterDetails('Escorting to the exam room 10 minutes before everyone else')
      .submitPageTo(CheckYourAnswersPage)
      .requiresExamArrangements('Escorting to the exam room 10 minutes before everyone else')

      // check and update specific teaching skills
      .doesNotRequireSpecificTeachingSkills()
      .clickSpecificTeachingSkillsChangeLink()
      .selectSpecificTeachingSkillsRequired()
      .enterDetails('Teacher with BSL proficiency required')
      .submitPageTo(CheckYourAnswersPage)
      .requiresSpecificTeachingSkills('Teacher with BSL proficiency required')

      // check and update learning environment adjustments
      .doesNotRequireLearningEnvironmentAdjustments()
      .clickLearningEnvironmentAdjustmentsChangeLink()
      .selectLearningAdjustmentsRequired()
      .enterDetails('Needs to sit at the front of the class')
      .submitPageTo(CheckYourAnswersPage)
      .requiresLearningEnvironmentAdjustments('Needs to sit at the front of the class')

      // check and update teaching adjustments
      .doesNotRequireTeachingAdjustments()
      .clickTeachingAdjustmentsChangeLink()
      .selectTeachingAdjustmentsRequired()
      .enterDetails('Use simpler examples to help students understand concepts')
      .submitPageTo(CheckYourAnswersPage)
      .requiresTeachingAdjustments('Use simpler examples to help students understand concepts')

      // check and update who created the plan
      .theLoggedInUserCreatedThePlan()
      .clickWhoCreatedThePlanChangeLink()
      .selectWhoCreatedThePlan(PlanCreatedByValue.SOMEBODY_ELSE)
      .enterFullName('Joe Bloggs')
      .enterJobRole('Peer Mentor')
      .submitPageTo(CheckYourAnswersPage)
      .thePlanWasCreatedBy('Joe Bloggs', 'Peer Mentor')

      // check and update other people consulted
      .clickOtherPeopleConsultedChangeLink()
      .submitPageTo(CheckYourAnswersPage)

    // Then
  })
})
