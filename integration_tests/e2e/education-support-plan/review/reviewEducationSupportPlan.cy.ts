import { addDays, addWeeks, format, startOfToday } from 'date-fns'
import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import Error404Page from '../../../pages/error404'
import OverviewPage from '../../../pages/profile/overviewPage'
import WhoReviewedThePlanPage from '../../../pages/education-support-plan/whoReviewedThePlanPage'
import PlanReviewedByValue from '../../../../server/enums/planReviewedByValue'
import OtherPeopleConsultedPage from '../../../pages/education-support-plan/otherPeopleConsultedPage'
import OtherPeopleConsultedAddPersonPage from '../../../pages/education-support-plan/otherPeopleConsultedAddPersonPage'
import OtherPeopleConsultedListPage from '../../../pages/education-support-plan/otherPeopleConsultedListPage'
import IndividualViewOnProgressPage from '../../../pages/education-support-plan/individualViewOnProgressPage'
import ReviewersViewOnProgressPage from '../../../pages/education-support-plan/reviewersViewOnProgressPage'
import ReviewExistingNeedsPage from '../../../pages/education-support-plan/reviewExistingNeedsPage'
import ReviewExistingStrengthsPage from '../../../pages/education-support-plan/reviewExistingStrengthsPage'
import ReviewExistingChallengesPage from '../../../pages/education-support-plan/reviewExistingChallengesPage'
import ReviewExistingConditionsPage from '../../../pages/education-support-plan/reviewExistingConditionsPage'
import ReviewExistingSupportStrategiesPage from '../../../pages/education-support-plan/reviewExistingSupportStrategiesPage'
import TeachingAdjustmentsPage from '../../../pages/education-support-plan/teachingAdjustmentsPage'
import SpecificTeachingSkillsPage from '../../../pages/education-support-plan/specificTeachingSkillsPage'
import ExamArrangementsPage from '../../../pages/education-support-plan/examArrangementsPage'
import LearningNeedsSupportPractitionerSupportPage from '../../../pages/education-support-plan/learningNeedsSupportPractitionerSupportPage'
import AdditionalInformationPage from '../../../pages/education-support-plan/additionalInformationPage'
import ReviewSupportPlanPage from '../../../pages/education-support-plan/reviewSupportPlanPage'
import CheckYourAnswersPage from '../../../pages/education-support-plan/checkYourAnswersPage'
import aPlanActionStatus from '../../../../server/testsupport/planActionStatusTestDataBuilder'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context('Review an Education Support Plan', () => {
  const prisonNumber = 'A00001A'
  const tomorrow = format(addDays(startOfToday(), 1), 'yyyy-MM-dd')

  beforeEach(() => {
    cy.task('reset')
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', {
      prisonNumber,
      planActionStatus: aPlanActionStatus({
        status: 'REVIEW_DUE',
        reviewDeadlineDate: tomorrow,
      }),
    })
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber })
    cy.task('stubGetSupportStrategies', { prisonNumber })
    cy.task('stubGetEducationSupportPlan', prisonNumber)
    cy.task('stubReviewEducationSupportPlan', prisonNumber)
  })

  it('should be able to navigate directly to the review Education Support Plan page', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`)

    // Then
    Page.verifyOnPage(WhoReviewedThePlanPage)
  })

  it('should review a prisoners Education Support Plan, triggering validation on every screen', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    const reviewDate = addWeeks(startOfToday(), 10)

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .actionsCardContainsEducationSupportPlanActions()
      .clickReviewEducationSupportPlanButton()

    // When
    Page.verifyOnPage(WhoReviewedThePlanPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(WhoReviewedThePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewedBy')
      // submit the page without the name or job role, triggering different validation
      .selectWhoReviewedThePlan(PlanReviewedByValue.SOMEBODY_ELSE)
      .submitPageTo(WhoReviewedThePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewedBy')
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
      .hasErrorCount(2)
      .hasFieldInError('fullName')
      .hasFieldInError('jobRole')
      // enter the fields and submit the form to the next page
      .enterFullName('A Teacher')
      .enterJobRole('Teacher')
      .submitPageTo(OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(1)
      .personAtRowIs(1, 'A Teacher', 'Teacher')
      .clickToAddAnotherPerson()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      .hasErrorCount(2)
      .hasFieldInError('fullName')
      .hasFieldInError('jobRole')
      // enter the fields and submit the form to the next page
      .enterFullName('Another Teacher')
      .enterJobRole('Teacher')
      .submitPageTo(OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(2)
      .personAtRowIs(1, 'A Teacher', 'Teacher')
      .personAtRowIs(2, 'Another Teacher', 'Teacher')
      .submitPageTo(IndividualViewOnProgressPage)

    Page.verifyOnPage(IndividualViewOnProgressPage)
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(IndividualViewOnProgressPage)
      .hasErrorCount(1)
      .hasFieldInError('prisonerViewOnProgress')
      // submit the page with both prisoner view and checkbox indicating they refused to take part, triggering different validation
      .enterPrisonersViewOnProgress('Chris is happy with his progress so far')
      .selectPrisonerDeclinedBeingPartOfReview()
      .submitPageTo(IndividualViewOnProgressPage)
      .hasErrorCount(1)
      .hasFieldInError('prisonerViewOnProgress')
      // clear the checkbox, submitting just the prisoner view on progress
      .deSelectPrisonerDeclinedBeingPartOfReview()
      .submitPageTo(ReviewersViewOnProgressPage)

    Page.verifyOnPage(ReviewersViewOnProgressPage)
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ReviewersViewOnProgressPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewersViewOnProgress')
      // enter the field and submit the form to the next page
      .enterReviewersViewOnProgress('Chris is working hard to improve his progress')
      .submitPageTo(ReviewExistingNeedsPage)

    Page.verifyOnPage(ReviewExistingNeedsPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ReviewExistingNeedsPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewExistingNeeds')
      // enter the fields and submit the form to the next page
      .selectReviewExistingNeeds()
      .submitPageTo(ReviewExistingStrengthsPage)

    Page.verifyOnPage(ReviewExistingStrengthsPage) //
      .submitPageTo(ReviewExistingChallengesPage)

    Page.verifyOnPage(ReviewExistingChallengesPage) //
      .submitPageTo(ReviewExistingConditionsPage)

    Page.verifyOnPage(ReviewExistingConditionsPage) //
      .submitPageTo(ReviewExistingSupportStrategiesPage)

    Page.verifyOnPage(ReviewExistingSupportStrategiesPage) //
      .submitPageTo(TeachingAdjustmentsPage)
      .hasNoErrors()
      // ELSP already has an answer to Teaching Adjustments - clear the answer to trigger a validation error
      .clearDetails()
      .submitPageTo(TeachingAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // Set answer to No and submit to the next page
      .selectTeachingAdjustmentsNotRequired()
      .submitPageTo(SpecificTeachingSkillsPage)

    Page.verifyOnPage(SpecificTeachingSkillsPage) //
      .hasNoErrors()
      // ELSP already has an answer to Teaching Skills - clear the answer to trigger a validation error
      .clearDetails()
      .submitPageTo(SpecificTeachingSkillsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // Set a new answer and submit to the next page
      .enterDetails('Teacher with some degree of BSL proficiency would be useful')
      .submitPageTo(ExamArrangementsPage)

    Page.verifyOnPage(ExamArrangementsPage)
      .hasNoErrors()
      // ELSP already has an answer to Exam Arrangements - clear the answer to trigger a validation error
      .clearDetails()
      .submitPageTo(ExamArrangementsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // Answer No and submit to the next page
      .selectExamArrangementsNotRequired()
      .submitPageTo(LearningNeedsSupportPractitionerSupportPage)

    Page.verifyOnPage(LearningNeedsSupportPractitionerSupportPage) //
      .hasNoErrors()
      // ELSP already has LNSP answers - clear the answer to trigger a validation error
      .clearDetails()
      .clearNumberOfHoursSupport()
      .submitPageTo(LearningNeedsSupportPractitionerSupportPage)
      .hasErrorCount(2)
      .hasFieldInError('details')
      .hasFieldInError('supportHours')
      // Answer No and submit to the next page
      .selectLnspSupportNotRequired()
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
      .enterAdditionalInformation('Chris was engaged and happy to review his plan today')
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
      .hasSuccessMessage('Review of education support plan recorded')
    cy.wiremockVerify(
      postRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/education-support-plan/review`),
      ).withRequestBody(
        matchingJsonPath(
          '$[?(' +
            "@.prisonId == 'BXI' && " +
            "@.reviewCreatedBy.name == 'Joe Bloggs' && " +
            "@.reviewCreatedBy.jobRole == 'Peer Mentor' && " +
            '@.otherContributors.size() == 2 && ' +
            "@.otherContributors[0].name == 'A Teacher' && " +
            "@.otherContributors[0].jobRole == 'Teacher' && " +
            "@.otherContributors[1].name == 'Another Teacher' && " +
            "@.otherContributors[1].jobRole == 'Teacher' && " +
            "@.prisonerFeedback == 'Chris is happy with his progress so far' && " +
            '@.prisonerDeclinedFeedback == false && ' +
            "@.reviewerFeedback == 'Chris is working hard to improve his progress' && " +
            '@.updateEducationSupportPlan.anyChanges == true && ' +
            '@.updateEducationSupportPlan.teachingAdjustments == null && ' +
            "@.updateEducationSupportPlan.specificTeachingSkills == 'Teacher with some degree of BSL proficiency would be useful' && " +
            '@.updateEducationSupportPlan.examAccessArrangements == null && ' +
            '@.updateEducationSupportPlan.lnspSupport == null && ' +
            '@.updateEducationSupportPlan.lnspSupportHours == null && ' +
            "@.updateEducationSupportPlan.detail == 'Chris was engaged and happy to review his plan today' && " +
            `@.nextReviewDate == '${format(reviewDate, 'yyyy-MM-dd')}'` +
            ')]',
        ),
      ),
    )
  })

  it('should not review a prisoners Education Support Plan given API returns an error response', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()
    cy.task('stubReviewEducationSupportPlan500Error', prisonNumber)

    cy.recordEducationSupportPlanReviewToArriveOnCheckYourAnswers({ prisonNumber })

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPageTo(CheckYourAnswersPage) // Submit the page but expect to stay on the Check Your Answers page due to API error

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not be able to review Education Support Plan given prisoner does not have an ELSP', () => {
    // Given
    cy.task('stubGetEducationSupportPlan404Error', prisonNumber)
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should redirect to Profile Overview page with API Error Banner given API returns an error retrieving the ELSP', () => {
    // Given
    cy.task('stubGetEducationSupportPlan500Error', prisonNumber)
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not be able to navigate directly to the review Education Support Plan page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to review ELSPs
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
