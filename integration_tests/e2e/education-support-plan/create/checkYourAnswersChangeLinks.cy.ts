/**
 * Cypress tests that test the Change links on the Check Your Answers page when creating an Education Support Plan
 */
import { addMonths, format, startOfToday, subDays } from 'date-fns'
import CheckYourAnswersPage from '../../../pages/education-support-plan/checkYourAnswersPage'
import Page from '../../../pages/page'
import PlanCreatedByValue from '../../../../server/enums/planCreatedByValue'
import OverviewPage from '../../../pages/profile/overviewPage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import OtherPeopleConsultedAddPersonPage from '../../../pages/education-support-plan/otherPeopleConsultedAddPersonPage'
import OtherPeopleConsultedListPage from '../../../pages/education-support-plan/otherPeopleConsultedListPage'

context(`Change links on the Check Your Answers page when creating an Education Support Plan`, () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to create ELSPs)
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubCreateEducationSupportPlan', prisonNumber)
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
      .enterNumberOfHoursSupport(40)
      .submitPageTo(CheckYourAnswersPage)
      .requiresLearningNeedsSupportPractitionerSupport(
        'Chris will need text reading to him as he cannot read himself',
        40,
      )

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
      .otherPeopleWereNotConsulted()
      .clickOtherPeopleConsultedChangeLink()
      .selectOtherPeopleWereConsulted()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      .enterFullName('Person 1')
      .enterJobRole('Teacher 1')
      .submitPageTo(OtherPeopleConsultedListPage)
      .clickToAddAnotherPerson()
      .enterFullName('Person 2')
      .enterJobRole('Teacher 2')
      .submitPageTo(OtherPeopleConsultedListPage)
      .clickToAddAnotherPerson()
      .enterFullName('Person 3')
      .enterJobRole('Teacher 3')
      .submitPageTo(OtherPeopleConsultedListPage)
      .submitPageTo(CheckYourAnswersPage)
      // check all added people are listed
      .hasNumberOfPeopleConsulted(3)
      .otherPersonConsultedWas(1, 'Person 1', 'Teacher 1')
      .otherPersonConsultedWas(2, 'Person 2', 'Teacher 2')
      .otherPersonConsultedWas(3, 'Person 3', 'Teacher 3')
      .clickOtherPeopleConsultedListChangeLink()
      .removePerson(3, OtherPeopleConsultedListPage)
      .submitPageTo(CheckYourAnswersPage)
      .hasNumberOfPeopleConsulted(2)
      .otherPersonConsultedWas(1, 'Person 1', 'Teacher 1')
      .otherPersonConsultedWas(2, 'Person 2', 'Teacher 2')

      // check and update additional information
      .hasAdditionalInformation('None entered')
      .clickAdditionalInformationChangeLink()
      .enterAdditionalInformation('Chris is feeling positive and is looking forward to starting education')
      .submitPageTo(CheckYourAnswersPage)
      .hasAdditionalInformation('Chris is feeling positive and is looking forward to starting education')

      // check and update individual support requirements
      .hasIndividualSupportRequirements('Prisoner has requested large print books to help with reading')
      .clickIndividualSupportRequirementsChangeLink()
      .enterSupportRequirements(
        'Chris has requested that he is sat at the front of the class, and for large print books to help with reading. He is keen to learn and does not want to be distracted by other disruptive people in the classroom environment.',
      )
      .submitPageTo(CheckYourAnswersPage)
      .hasIndividualSupportRequirements(
        'Chris has requested that he is sat at the front of the class, and for large print books to help with reading. He is keen to learn and does not want to be distracted by other disruptive people in the classroom environment.',
      )

      // submit Check Your Answers page
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
              "@.otherContributors[0].name == 'Person 1' && " +
              "@.otherContributors[0].jobRole == 'Teacher 1' && " +
              "@.otherContributors[1].name == 'Person 2' && " +
              "@.otherContributors[1].jobRole == 'Teacher 2' && " +
              '@.hasCurrentEhcp == true && ' +
              "@.teachingAdjustments == 'Use simpler examples to help students understand concepts' && " +
              "@.specificTeachingSkills == 'Teacher with BSL proficiency required' && " +
              "@.examAccessArrangements == 'Escorting to the exam room 10 minutes before everyone else' && " +
              "@.lnspSupport == 'Chris will need text reading to him as he cannot read himself' && " +
              '@.lnspSupportHours == 40 && ' +
              "@.individualSupport == 'Chris has requested that he is sat at the front of the class, and for large print books to help with reading. He is keen to learn and does not want to be distracted by other disruptive people in the classroom environment.' && " +
              "@.detail == 'Chris is feeling positive and is looking forward to starting education' && " +
              `@.reviewDate == '${format(updatedReviewDate, 'yyyy-MM-dd')}'` +
              ')]',
          ),
        ),
    )
  })
})
