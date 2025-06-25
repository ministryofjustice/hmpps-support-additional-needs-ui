import { addMonths, format, startOfToday } from 'date-fns'
import { RequestPatternBuilder } from '../mockApis/wiremock/requestPatternBuilder'
import { verify } from '../mockApis/wiremock'
import WhoCreatedThePlanPage from '../pages/education-support-plan/whoCreatedThePlanPage'
import Page from '../pages/page'
import PlanCreatedByValue from '../../server/enums/planCreatedByValue'
import OtherPeopleConsultedPage from '../pages/education-support-plan/otherPeopleConsultedPage'
import ReviewNeedsConditionsStrengthsPage from '../pages/education-support-plan/reviewNeedsConditionsStrengthsPage'
import LearningEnvironmentAdjustmentsPage from '../pages/education-support-plan/learningEnvironmentAdjustmentsPage'
import TeachingAdjustmentsPage from '../pages/education-support-plan/teachingAdjustmentsPage'
import SpecificTeachingSkillsPage from '../pages/education-support-plan/specificTeachingSkillsPage'
import ExamArrangementsPage from '../pages/education-support-plan/examArrangementsPage'
import EducationHealthCarePlanPage from '../pages/education-support-plan/educationHealthCarePlanPage'
import LearningNeedsSupportPractitionerSupportPage from '../pages/education-support-plan/learningNeedsSupportPractitionerSupportPage'
import ReviewSupportPlanPage from '../pages/education-support-plan/reviewSupportPlanPage'
import CheckYourAnswersPage from '../pages/education-support-plan/checkYourAnswersPage'
import AdditionalInformationPage from '../pages/education-support-plan/additionalInformationPage'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('wiremockVerify', (requestPatternBuilder: RequestPatternBuilder, expectedCount?: number) => {
  return cy.wrap(verify(expectedCount == null ? 1 : expectedCount, requestPatternBuilder)).should('be.true')
})

Cypress.Commands.add('wiremockVerifyNoInteractions', (requestPatternBuilder: RequestPatternBuilder) => {
  return cy.wrap(verify(0, requestPatternBuilder)).should('be.true')
})

Cypress.Commands.add(
  'createEducationSupportPlanToArriveOnCheckYourAnswers',
  (options?: { prisonNumber?: string; reviewDate?: Date }) => {
    const reviewDate = options?.reviewDate || addMonths(startOfToday(), 3)

    cy.visit(`/education-support-plan/${options?.prisonNumber || 'G6115VJ'}/create/who-created-the-plan`)

    Page.verifyOnPage(WhoCreatedThePlanPage) //
      .selectWhoCreatedThePlan(PlanCreatedByValue.MYSELF)
      .submitPageTo(OtherPeopleConsultedPage)
      //
      .selectOtherPeopleWereNotConsulted()
      .submitPageTo(ReviewNeedsConditionsStrengthsPage)
      //
      .submitPageTo(LearningEnvironmentAdjustmentsPage)
      //
      .selectLearningAdjustmentsNotRequired()
      .submitPageTo(TeachingAdjustmentsPage)
      //
      .selectTeachingAdjustmentsNotRequired()
      .submitPageTo(SpecificTeachingSkillsPage)
      //
      .selectSpecificTeachingSkillsNotRequired()
      .submitPageTo(ExamArrangementsPage)
      //
      .selectExamArrangementsNotRequired()
      .submitPageTo(EducationHealthCarePlanPage)
      //
      .selectDoesNotHaveCurrentEhcp()
      .submitPageTo(LearningNeedsSupportPractitionerSupportPage)
      //
      .selectLnspSupportNotRequired()
      .submitPageTo(AdditionalInformationPage)
      //
      .clearAdditionalInformation()
      .submitPageTo(ReviewSupportPlanPage)
      //
      .setReviewDate(format(reviewDate, 'd/M/yyyy'))
      .submitPageTo(CheckYourAnswersPage)
  },
)
