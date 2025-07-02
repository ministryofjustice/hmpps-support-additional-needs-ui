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
import AdditionalInformationPage from '../../../pages/education-support-plan/additionalInformationPage'

context('Create an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
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
      .submitPageTo(AdditionalInformationPage)

    Page.verifyOnPage(AdditionalInformationPage) //
      // submit the page with invalid content to trigger a validation error
      .enterAdditionalInformation(
        // Enter additional information that is just over 4000 characters
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae ipsum suscipit, interdum mauris non, posuere lacus. Cras laoreet lectus eget ligula auctor, vitae pulvinar lectus convallis. Duis aliquam nulla eros, eget eleifend tortor tempus id. Maecenas mollis sollicitudin nulla tempus pellentesque. Vestibulum nec mattis orci, ut condimentum turpis. Curabitur sed urna ut sem ullamcorper varius. Sed nec interdum neque. Proin tristique arcu vel tortor mollis consequat at vel lacus.
Fusce quis semper nisl. Integer ullamcorper tortor a porta vehicula. Proin sit amet finibus ipsum. In mattis sit amet sapien et hendrerit. Nunc placerat faucibus erat, ac luctus lorem tincidunt sodales. Praesent ut egestas ligula. Aliquam in aliquet dolor, vitae laoreet quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque lacinia ante nec rhoncus egestas. In orci nisi, elementum nec varius sed, aliquet nec nibh. Donec lacus magna, lobortis nec nisl vitae, interdum viverra erat. Donec semper fringilla leo ut cursus. Etiam et lacinia mauris, vitae laoreet sapien. Aliquam pulvinar tristique tortor, in tristique lorem consectetur vitae.
Phasellus feugiat purus justo, id auctor arcu bibendum in. Proin urna turpis, accumsan sed commodo nec, posuere sed nisl. Integer facilisis quis urna malesuada bibendum. Etiam vitae mi aliquet, tincidunt augue ut, finibus justo. Morbi at placerat sem. Sed ultricies tristique luctus. Proin sed vulputate justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eu ornare eros. Donec id erat eros. Aliquam lorem magna, varius sed odio interdum, interdum semper elit. Suspendisse potenti. Maecenas fermentum rutrum lorem, ac efficitur sapien convallis ac. Mauris elementum, nisl sed laoreet tincidunt, ipsum turpis ornare dolor, in pretium augue mi at eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
Sed viverra, urna et vehicula lobortis, nunc mi elementum mauris, ac rutrum lorem orci nec lorem. Cras condimentum dictum facilisis. Maecenas eget euismod mi, vitae rhoncus velit. Aliquam erat volutpat. Nunc gravida mollis nisl, quis sagittis risus pharetra eget. Suspendisse potenti. In fermentum finibus eros sit amet faucibus. Aenean et ultricies eros.
Suspendisse eros urna, blandit at erat sit amet, cursus dictum tellus. Pellentesque ut interdum lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam varius, orci eget molestie molestie, ex est condimentum tortor, sit amet pharetra nisl nunc ac risus. Sed lectus nunc, ornare aliquam nulla vel, egestas pretium velit. Nunc feugiat risus a luctus porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur purus lectus, eu feugiat sapien iaculis eget. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur vel lorem eu neque malesuada sollicitudin. Nullam euismod mauris in lacinia varius. Integer id tempor leo.
Vestibulum ut fermentum lacus, sed finibus ipsum. Nullam lacinia velit at pharetra bibendum. Duis a velit ac eros vulputate consequat. Cras dui arcu, laoreet in molestie in, ultrices et leo. Maecenas eleifend molestie turpis. Cras varius nibh ut accumsan pretium. Donec ut velit venenatis, venenatis velit id, egestas sapien. Integer hendrerit quam vitae nibh blandit, quis bibendum sapien sagittis. Etiam maximus nisl eget placerat pretium.
Nam quis odio nulla. Nam metus arcu, tempus quis viverra non, varius ac felis. Morbi commodo purus consectetur leo molestie, et congue lorem blandit. Sed nec enim sit amet dolor gravida vulputate in quis urna. Curabitur tristique neque nec tortor lobortis, at ullamcorper urna vestibulum. Suspendisse porttitor scelerisque fringilla. Aenean sit amet erat sit amet sapien feugiat hendrerit at in lacus. Sed nec bibendum dolor. Aenean accumsan, purus sit amet pellentesque bibendum, ex dui vehicula urna, fringilla semper justo.`,
      )
      .submitPageTo(AdditionalInformationPage)
      .hasErrorCount(1)
      .hasFieldInError('additionalInformation')
      // enter the fields and submit the form to the next page
      .enterAdditionalInformation('Chris was a pleasure to meet with today')
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
              "@.detail == 'Chris was a pleasure to meet with today' && " +
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
