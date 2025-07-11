import Page, { PageElement } from '../page'
import WhoCreatedThePlanPage from './whoCreatedThePlanPage'
import OtherPeopleConsultedPage from './otherPeopleConsultedPage'
import TeachingAdjustmentsPage from './teachingAdjustmentsPage'
import SpecificTeachingSkillsPage from './specificTeachingSkillsPage'
import ExamArrangementsPage from './examArrangementsPage'
import EducationHealthCarePlanPage from './educationHealthCarePlanPage'
import LearningNeedsSupportPractitionerSupportPage from './learningNeedsSupportPractitionerSupportPage'
import ReviewSupportPlanPage from './reviewSupportPlanPage'
import OtherPeopleConsultedListPage from './otherPeopleConsultedListPage'
import zeroIndexed from '../../utils/zeroIndexed'
import AdditionalInformationPage from './additionalInformationPage'
import IndividualSupportRequirementsPage from './individualSupportRequirementsPage'

export default class CheckYourAnswersPage extends Page {
  constructor() {
    super('education-support-plan-check-your-answers')
  }

  clickWhoCreatedThePlanChangeLink(): WhoCreatedThePlanPage {
    this.whoCreatedThePlanChangeLink().click()
    return Page.verifyOnPage(WhoCreatedThePlanPage)
  }

  theLoggedInUserCreatedThePlan(): CheckYourAnswersPage {
    this.whoCreatedThePlanValue().should('contain.text', 'Yes')
    this.whoCreatedThePlanValue().find('div').should('not.exist')
    return this
  }

  thePlanWasCreatedBy(expectedName: string, expectedJobRole: string): CheckYourAnswersPage {
    this.whoCreatedThePlanValue().should('contain.text', 'No')
    this.whoCreatedThePlanValue()
      .find('div')
      .should('be.visible')
      .should('contain.text', expectedName)
      .should('contain.text', expectedJobRole)
    return this
  }

  clickOtherPeopleConsultedChangeLink(): OtherPeopleConsultedPage {
    this.otherPeopleConsultedChangeLink().click()
    return Page.verifyOnPage(OtherPeopleConsultedPage)
  }

  otherPeopleWereConsulted(): CheckYourAnswersPage {
    this.otherPeopleConsultedValue().should('contain.text', 'Yes')
    this.otherPeopleConsultedListValue().should('be.visible')
    return this
  }

  otherPeopleWereNotConsulted(): CheckYourAnswersPage {
    this.otherPeopleConsultedValue().should('contain.text', 'No')
    this.otherPeopleConsultedListValue().should('not.exist')
    return this
  }

  clickOtherPeopleConsultedListChangeLink(): OtherPeopleConsultedListPage {
    this.otherPeopleConsultedListChangeLink().click()
    return Page.verifyOnPage(OtherPeopleConsultedListPage)
  }

  hasNumberOfPeopleConsulted(expected: number): CheckYourAnswersPage {
    this.otherPeopleConsultedListValue() //
      .should('be.visible')
      .find('dd')
      .should('have.length', expected)
    return this
  }

  otherPersonConsultedWas(row: number, expectedName: string): CheckYourAnswersPage {
    this.otherPeopleConsultedListValue()
      .should('be.visible')
      .find('dd')
      .eq(zeroIndexed(row))
      .should('contain.text', expectedName)
    return this
  }

  clickTeachingAdjustmentsChangeLink(): TeachingAdjustmentsPage {
    this.teachingAdjustmentsChangeLink().click()
    return Page.verifyOnPage(TeachingAdjustmentsPage)
  }

  doesNotRequireTeachingAdjustments(): CheckYourAnswersPage {
    this.teachingAdjustmentsValue().should('contain.text', 'No')
    this.teachingAdjustmentsValue().find('span').should('not.exist')
    return this
  }

  requiresTeachingAdjustments(expected: string): CheckYourAnswersPage {
    this.teachingAdjustmentsValue().should('contain.text', 'Yes')
    this.teachingAdjustmentsValue().find('span').should('be.visible').should('contain.text', expected)
    return this
  }

  clickSpecificTeachingSkillsChangeLink(): SpecificTeachingSkillsPage {
    this.specificTeachingSkillsChangeLink().click()
    return Page.verifyOnPage(SpecificTeachingSkillsPage)
  }

  doesNotRequireSpecificTeachingSkills(): CheckYourAnswersPage {
    this.specificTeachingSkillsValue().should('contain.text', 'No')
    this.specificTeachingSkillsValue().find('span').should('not.exist')
    return this
  }

  requiresSpecificTeachingSkills(expected: string): CheckYourAnswersPage {
    this.specificTeachingSkillsValue().should('contain.text', 'Yes')
    this.specificTeachingSkillsValue().find('span').should('be.visible').should('contain.text', expected)
    return this
  }

  clickExamArrangementsChangeLink(): ExamArrangementsPage {
    this.examArrangementsChangeLink().click()
    return Page.verifyOnPage(ExamArrangementsPage)
  }

  doesNotRequireExamArrangements(): CheckYourAnswersPage {
    this.examArrangementsValue().should('contain.text', 'No')
    this.examArrangementsValue().find('span').should('not.exist')
    return this
  }

  requiresExamArrangements(expected: string): CheckYourAnswersPage {
    this.examArrangementsValue().should('contain.text', 'Yes')
    this.examArrangementsValue().find('span').should('be.visible').should('contain.text', expected)
    return this
  }

  clickEducationHealthCarePlanChangeLink(): EducationHealthCarePlanPage {
    this.educationHealthCarePlanChangeLink().click()
    return Page.verifyOnPage(EducationHealthCarePlanPage)
  }

  hasCurrentEducationHealthCarePlan(): CheckYourAnswersPage {
    this.educationHealthCarePlanValue().should('contain.text', 'Yes')
    return this
  }

  doesNotHaveCurrentEducationHealthCarePlan(): CheckYourAnswersPage {
    this.educationHealthCarePlanValue().should('contain.text', 'No')
    return this
  }

  clickLearningNeedsSupportPractitionerSupportChangeLink(): LearningNeedsSupportPractitionerSupportPage {
    this.lnspSupportChangeLink().click()
    return Page.verifyOnPage(LearningNeedsSupportPractitionerSupportPage)
  }

  doesNotRequireLearningNeedsSupportPractitionerSupport(): CheckYourAnswersPage {
    this.lnspSupportValue().should('contain.text', 'No')
    this.lnspSupportValue().find('span').should('not.exist')
    return this
  }

  requiresLearningNeedsSupportPractitionerSupport(expected: string): CheckYourAnswersPage {
    this.lnspSupportValue().should('contain.text', 'Yes')
    this.lnspSupportValue().find('span').should('be.visible').should('contain.text', expected)
    return this
  }

  clickAdditionalInformationChangeLink(): AdditionalInformationPage {
    this.additionalInformationChangeLink().click()
    return Page.verifyOnPage(AdditionalInformationPage)
  }

  hasAdditionalInformation(expected: string): CheckYourAnswersPage {
    this.additionalInformationValue().should('contain.text', expected)
    return this
  }

  clickIndividualSupportRequirementsChangeLink(): IndividualSupportRequirementsPage {
    this.individualSupportRequirementsChangeLink().click()
    return Page.verifyOnPage(IndividualSupportRequirementsPage)
  }

  hasIndividualSupportRequirements(expected: string): CheckYourAnswersPage {
    this.individualSupportRequirementsValue().should('contain.text', expected)
    return this
  }

  clickReviewDateChangeLink(): ReviewSupportPlanPage {
    this.reviewDateChangeLink().click()
    return Page.verifyOnPage(ReviewSupportPlanPage)
  }

  hasReviewDate(expected: string): CheckYourAnswersPage {
    this.reviewDateValue().should('contain.text', expected)
    return this
  }

  private whoCreatedThePlanValue = (): PageElement => cy.get('[data-qa=who-created-the-plan]')

  private whoCreatedThePlanChangeLink = (): PageElement => cy.get('[data-qa=who-created-the-plan-change-link]')

  private otherPeopleConsultedValue = (): PageElement => cy.get('[data-qa=other-people-consulted]')

  private otherPeopleConsultedChangeLink = (): PageElement => cy.get('[data-qa=other-people-consulted-change-link]')

  private otherPeopleConsultedListValue = (): PageElement => cy.get('[data-qa=other-people-consulted-list]')

  private otherPeopleConsultedListChangeLink = (): PageElement =>
    cy.get('[data-qa=other-people-consulted-list-change-link]')

  private teachingAdjustmentsValue = (): PageElement => cy.get('[data-qa=teaching-adjustments]')

  private teachingAdjustmentsChangeLink = (): PageElement => cy.get('[data-qa=teaching-adjustments-change-link]')

  private specificTeachingSkillsValue = (): PageElement => cy.get('[data-qa=specific-teaching-skills]')

  private specificTeachingSkillsChangeLink = (): PageElement => cy.get('[data-qa=specific-teaching-skills-change-link]')

  private examArrangementsValue = (): PageElement => cy.get('[data-qa=exam-arrangements]')

  private examArrangementsChangeLink = (): PageElement => cy.get('[data-qa=exam-arrangements-change-link]')

  private educationHealthCarePlanValue = (): PageElement => cy.get('[data-qa=education-health-care-plan]')

  private educationHealthCarePlanChangeLink = (): PageElement =>
    cy.get('[data-qa=education-health-care-plan-change-link]')

  private lnspSupportValue = (): PageElement => cy.get('[data-qa=lnsp-support]')

  private lnspSupportChangeLink = (): PageElement => cy.get('[data-qa=lnsp-support-change-link]')

  private additionalInformationValue = (): PageElement => cy.get('[data-qa=additional-information]')

  private additionalInformationChangeLink = (): PageElement => cy.get('[data-qa=additional-information-change-link]')

  private reviewDateValue = (): PageElement => cy.get('[data-qa=review-date]')

  private reviewDateChangeLink = (): PageElement => cy.get('[data-qa=review-date-change-link]')

  private individualSupportRequirementsValue = (): PageElement => cy.get('[data-qa=individual-support-requirements]')

  private individualSupportRequirementsChangeLink = (): PageElement =>
    cy.get('[data-qa=individual-support-requirements-change-link]')
}
