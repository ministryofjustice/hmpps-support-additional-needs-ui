import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import EducationHealthCarePlanPage from '../education-support-plan/educationHealthCarePlanPage'

export default class EducationSupportPlanPage extends ProfilePage {
  constructor() {
    super('profile-education-support-plan')
    this.activeTabIs('Education support plan')
  }

  hasNoEducationSupportPlanDisplayed(): EducationSupportPlanPage {
    this.educationSupportPlanSummaryCard().should('contain.text', 'No education support plan recorded')
    this.educationSupportPlanPersonsViewSummaryCard().should('not.exist')
    this.educationSupportPlanCreatedAuditFieldsSummaryCard().should('not.exist')
    return this
  }

  hasLinkToCreateEducationSupportPlanBy(expectedDate: string): EducationSupportPlanPage {
    this.educationSupportPlanSummaryCard().should('contain.text', `Create an education support plan by ${expectedDate}`)
    return this
  }

  hasAdjustmentsToTeachingEnvironment(expected: string): EducationSupportPlanPage {
    this.teachingEnvironmentAdjustments().should('contain.text', expected)
    return this
  }

  hasSpecificTeacherKnowledgeRequired(expected: string): EducationSupportPlanPage {
    this.specificTeachingSkills().should('contain.text', expected)
    return this
  }

  hasExamAccessArrangements(expected: string): EducationSupportPlanPage {
    this.examAccessArrangements().should('contain.text', expected)
    return this
  }

  hasLearningNeedsSupport(expected: string): EducationSupportPlanPage {
    this.lnspSupport().should('contain.text', expected)
    return this
  }

  hasOtherDetails(expected: string): EducationSupportPlanPage {
    this.additionalInformation().should('contain.text', expected)
    return this
  }

  hasCurrentEhcp(): EducationSupportPlanPage {
    this.ehcp().should('contain.text', 'Yes')
    return this
  }

  doesNotHaveCurrentEhcp(): EducationSupportPlanPage {
    this.ehcp().should('contain.text', 'No')
    return this
  }

  clickToUpdateEhcp(): EducationHealthCarePlanPage {
    this.ehcpChangeLink().click()
    return Page.verifyOnPage(EducationHealthCarePlanPage)
  }

  showsPlanDeclinedRecordedBy(expectedRecordedBy: string, expectedRecordedAt: string): EducationSupportPlanPage {
    this.educationSupportPlanSummaryCard().should('not.exist')
    this.declinedEducationSupportPlanSummaryCard().should('be.visible')
    this.declinedPlanRecordedBy().should('contain.text', expectedRecordedBy)
    this.declinedPlanRecordedAt().should('contain.text', expectedRecordedAt)
    return this
  }

  private educationSupportPlanSummaryCard = (): PageElement => cy.get('[data-qa=education-support-plan-summary-card]')

  private educationSupportPlanPersonsViewSummaryCard = (): PageElement =>
    cy.get('[data-qa=education-support-plan-persons-view-summary-card]')

  private educationSupportPlanCreatedAuditFieldsSummaryCard = (): PageElement =>
    cy.get('[data-qa=education-support-plan-created-audit-fields-summary-card]')

  private teachingEnvironmentAdjustments = (): PageElement => cy.get('[data-qa=teaching-adjustments]')

  private specificTeachingSkills = (): PageElement => cy.get('[data-qa=specific-teaching-skills]')

  private examAccessArrangements = (): PageElement => cy.get('[data-qa=exam-arrangements]')

  private lnspSupport = (): PageElement => cy.get('[data-qa=lnsp-support]')

  private additionalInformation = (): PageElement => cy.get('[data-qa=additional-information]')

  private ehcp = (): PageElement => cy.get('[data-qa=education-health-care-plan]')

  private ehcpChangeLink = (): PageElement => cy.get('[data-qa=ehcp-change-link')

  private declinedEducationSupportPlanSummaryCard = (): PageElement =>
    cy.get('[data-qa=declined-education-support-plan-summary-card]')

  private declinedPlanRecordedBy = (): PageElement => cy.get('[data-qa=plan-declined-recorded-by]')

  private declinedPlanRecordedAt = (): PageElement => cy.get('[data-qa=plan-declined-recorded-at]')
}
