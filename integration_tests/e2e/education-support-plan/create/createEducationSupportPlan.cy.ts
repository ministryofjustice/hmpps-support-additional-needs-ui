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
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context('Create an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubCreateEducationSupportPlan', prisonNumber)
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
    const reviewDate = addWeeks(startOfToday(), 10)

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
      .numberOfPeopleConsultedIs(1)
      .personAtRowIs(1, 'A Teacher')
      .clickToAddAnotherPerson()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      .hasErrorCount(1)
      .hasFieldInError('fullName')
      // enter the fields and submit the form to the next page
      .enterFullName('Another Teacher')
      .submitPageTo(OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(2)
      .personAtRowIs(1, 'A Teacher')
      .personAtRowIs(2, 'Another Teacher')

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
      .setReviewDate(format(reviewDate, 'd/M/yyyy'))
      .submitPageTo(CheckYourAnswersPage)

    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPageTo(OverviewPage)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Education support plan created')
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/education-support-plan`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.planCreatedBy.name == 'Joe Bloggs' && " +
              "@.planCreatedBy.jobRole == 'Peer Mentor' && " +
              '@.otherContributors.size() == 2 && ' +
              "@.otherContributors[0].name == 'A Teacher' && " +
              "@.otherContributors[0].jobRole == 'N/A' && " +
              "@.otherContributors[1].name == 'Another Teacher' && " +
              "@.otherContributors[1].jobRole == 'N/A' && " +
              '@.hasCurrentEhcp == true && ' +
              "@.learningEnvironmentAdjustments == 'Needs to sit at the front of the class' && " +
              "@.teachingAdjustments == 'Use simpler examples to help students understand concepts' && " +
              "@.specificTeachingSkills == 'Adopt a more inclusive approach to teaching' && " +
              "@.examAccessArrangements == 'Chris needs escorting to the exam room 10 minutes before everyone else' && " +
              "@.lnspSupport == 'Chris will need the text reading to him as he cannot read himself' && " +
              `@.reviewDate == '${format(reviewDate, 'yyyy-MM-dd')}'` +
              ')]',
          ),
        ),
    )
  })

  it('should not create a prisoners Education Support Plan given API returns an error response', () => {
    // Given
    cy.task('stubCreateEducationSupportPlan500Error', prisonNumber)

    cy.createEducationSupportPlanToArriveOnCheckYourAnswers({ prisonNumber })

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPageTo(CheckYourAnswersPage) // Submit the page but expect to stay on the Check Your Answers page due to API error

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsDisplayed()
  })
})
