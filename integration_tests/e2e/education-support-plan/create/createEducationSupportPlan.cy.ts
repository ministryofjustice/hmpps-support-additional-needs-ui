import { addWeeks, format, startOfToday } from 'date-fns'
import WhoCreatedThePlanPage from '../../../pages/education-support-plan/whoCreatedThePlanPage'
import Page from '../../../pages/page'
import PlanCreatedByValue from '../../../../server/enums/planCreatedByValue'
import OtherPeopleConsultedPage from '../../../pages/education-support-plan/otherPeopleConsultedPage'
import OtherPeopleConsultedAddPersonPage from '../../../pages/education-support-plan/otherPeopleConsultedAddPersonPage'
import OtherPeopleConsultedListPage from '../../../pages/education-support-plan/otherPeopleConsultedListPage'
import ReviewNeedsConditionsStrengthsPage from '../../../pages/education-support-plan/reviewNeedsConditionsStrengthsPage'
import OverviewPage from '../../../pages/profile/overview/overviewPage'
import LearningEnvironmentAdjustmentsPage from '../../../pages/education-support-plan/learningEnvironmentAdjustmentsPage'
import TeachingAdjustmentsPage from '../../../pages/education-support-plan/teachingAdjustmentsPage'
import SpecificTeachingSkillsPage from '../../../pages/education-support-plan/specificTeachingSkillsPage'
import ExamArrangementsPage from '../../../pages/education-support-plan/examArrangementsPage'
import EducationHealthCarePlanPage from '../../../pages/education-support-plan/educationHealthCarePlanPage'
import LearningNeedsSupportPractitionerSupportPage from '../../../pages/education-support-plan/learningNeedsSupportPractitionerSupportPage'
import ReviewSupportPlanPage from '../../../pages/education-support-plan/reviewSupportPlanPage'
import CheckYourAnswersPage from '../../../pages/education-support-plan/checkYourAnswersPage'

context('Create an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should be able to navigate directly to the create Education Support Plan page', () => {
    // Given

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/create/who-created-the-plan`)

    // Then
    Page.verifyOnPage(WhoCreatedThePlanPage)
  })

  it('should create a prisoners Education Support Plan, triggering validation on every screen', () => {
    // Given
    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .actionsCardContainsEducationSupportPlanActions()
      .clickCreateEducationSupportPlanButton()

    // When
    Page.verifyOnPage(WhoCreatedThePlanPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(WhoCreatedThePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('completedBy')
      // submit the page without the name or job role, triggering different validation
      .selectWhoCreatedThePlan(PlanCreatedByValue.SOMEBODY_ELSE)
      .submitPageTo(WhoCreatedThePlanPage)
      .hasErrorCount(2)
      .hasFieldInError('completedByOtherFullName')
      .hasFieldInError('completedByOtherJobRole')
      // enter the fields and submit the form to the next page
      .enterFullName('Joe Bloggs')
      .enterJobRole('Peer Mentor')
      .submitPageTo(OtherPeopleConsultedPage)

    Page.verifyOnPage(OtherPeopleConsultedPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(OtherPeopleConsultedPage)
      .hasErrorCount(1)
      .hasFieldInError('wereOtherPeopleConsulted')
      // enter the fields and submit the form to the next page
      .selectOtherPeopleWereConsulted()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)

    Page.verifyOnPage(OtherPeopleConsultedAddPersonPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      .hasErrorCount(1)
      .hasFieldInError('fullName')
      // enter the fields and submit the form to the next page
      .enterFullName('A Teacher')
      .submitPageTo(OtherPeopleConsultedListPage)

    Page.verifyOnPage(OtherPeopleConsultedListPage) //
      .submitPageTo(ReviewNeedsConditionsStrengthsPage)

    Page.verifyOnPage(ReviewNeedsConditionsStrengthsPage) //
      .submitPageTo(LearningEnvironmentAdjustmentsPage)

    Page.verifyOnPage(LearningEnvironmentAdjustmentsPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(LearningEnvironmentAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('adjustmentsNeeded')
      // submit the page without the details, triggering different validation
      .selectLearningAdjustmentsRequired()
      .submitPageTo(LearningEnvironmentAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // enter the fields and submit the form to the next page
      .enterDetails('Needs to sit at the front of the class')
      .submitPageTo(TeachingAdjustmentsPage)

    Page.verifyOnPage(TeachingAdjustmentsPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(TeachingAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('adjustmentsNeeded')
      // submit the page without the details, triggering different validation
      .selectTeachingAdjustmentsRequired()
      .submitPageTo(TeachingAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // enter the fields and submit the form to the next page
      .enterDetails('Use simpler examples to help students understand concepts')
      .submitPageTo(SpecificTeachingSkillsPage)

    Page.verifyOnPage(SpecificTeachingSkillsPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(SpecificTeachingSkillsPage)
      .hasErrorCount(1)
      .hasFieldInError('skillsRequired')
      // submit the page without the details, triggering different validation
      .selectSpecificTeachingSkillsRequired()
      .submitPageTo(SpecificTeachingSkillsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // enter the fields and submit the form to the next page
      .enterDetails('Adopt a more inclusive approach to teaching')
      .submitPageTo(ExamArrangementsPage)

    Page.verifyOnPage(ExamArrangementsPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ExamArrangementsPage)
      .hasErrorCount(1)
      .hasFieldInError('arrangementsNeeded')
      // submit the page without the details, triggering different validation
      .selectExamArrangementsRequired()
      .submitPageTo(ExamArrangementsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // enter the fields and submit the form to the next page
      .enterDetails('Chris needs escorting to the exam room 10 minutes before everyone else')
      .submitPageTo(EducationHealthCarePlanPage)

    Page.verifyOnPage(EducationHealthCarePlanPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(EducationHealthCarePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('hasCurrentEhcp')
      // enter the fields and submit the form to the next page
      .selectHasCurrentEhcp()
      .submitPageTo(LearningNeedsSupportPractitionerSupportPage)

    Page.verifyOnPage(LearningNeedsSupportPractitionerSupportPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(LearningNeedsSupportPractitionerSupportPage)
      .hasErrorCount(1)
      .hasFieldInError('supportRequired')
      // submit the page without the details, triggering different validation
      .selectLnspSupportRequired()
      .submitPageTo(LearningNeedsSupportPractitionerSupportPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // enter the fields and submit the form to the next page
      .enterDetails('Chris will need the text reading to him as he cannot read himself')
      .submitPageTo(ReviewSupportPlanPage)

    Page.verifyOnPage(ReviewSupportPlanPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ReviewSupportPlanPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewDate')
      // submit the page with an invalid format date
      .setReviewDate('3rd January 2022')
      .submitPageTo(ReviewSupportPlanPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewDate')
      // enter the fields and submit the form to the next page
      .setReviewDate(format(addWeeks(startOfToday(), 10), 'd/M/yyyy'))
      .submitPageTo(CheckYourAnswersPage)

    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPageTo(OverviewPage)

    // Then
    // TODO - assert expected data was sent to API to create the ELSP
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Education support plan created')
  })
})
