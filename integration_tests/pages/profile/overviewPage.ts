import Page, { PageElement } from '../page'
import WhoCreatedThePlanPage from '../education-support-plan/whoCreatedThePlanPage'
import ReasonPage from '../education-support-plan/refuse-plan/reasonPage'
import ProfilePage from './profilePage'

export default class OverviewPage extends ProfilePage {
  constructor() {
    super('profile-overview')
    this.activeTabIs('Overview')
  }

  hasNoAdditionalNeedsRecorded(): OverviewPage {
    this.additionalNeedsSummaryCardContent().should('contain', 'No additional needs recorded')
    return this
  }

  hasNoStrengthsRecorded(): OverviewPage {
    this.strengthsSummaryCardContent().should('contain', 'No strengths recorded')
    return this
  }

  hasNoConditionsRecorded(): OverviewPage {
    this.conditionsSummaryCardContent().should('contain', 'No conditions recorded')
    return this
  }

  hasNoSupportRecommendationsRecorded(): OverviewPage {
    this.supportRecommendationsSummaryCardContent().should('contain', 'No support recommendations recorded')
    return this
  }

  actionsCardIsNotPresent(): OverviewPage {
    // Technically the action card as a HTML element is always present. If it contains no `li` elements then we use CSS to hide it
    // but because the runtime on CircleCI does not process/render the css we cannot use `.should('not.be.visible')`
    // Instead we will ensure there are zero `li` elements within it, and trust that the css hides the element in this case.
    this.actionsCard().should('exist')
    this.educationSupportPlanActionItems().should('not.exist')
    return this
  }

  actionsCardContainsEducationSupportPlanActions(): OverviewPage {
    this.actionsCard().should('exist')
    this.educationSupportPlanActionItems().should('exist')
    return this
  }

  clickCreateEducationSupportPlanButton(): WhoCreatedThePlanPage {
    this.createEducationSupportPlanButton().click()
    return Page.verifyOnPage(WhoCreatedThePlanPage)
  }

  clickRefuseEducationSupportPlanButton(): ReasonPage {
    this.refuseEducationSupportPlanButton().click()
    return Page.verifyOnPage(ReasonPage)
  }

  private additionalNeedsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=additional-needs-summary-card] .govuk-summary-card__content')

  private addAdditionalNeedButton = (): PageElement => cy.get('[data-qa=add-additional-need-button]')

  private conditionsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=conditions-summary-card] .govuk-summary-card__content')

  private addConditionButton = (): PageElement => cy.get('[data-qa=add-condition-button]')

  private strengthsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=strengths-summary-card] .govuk-summary-card__content')

  private addStrengthButton = (): PageElement => cy.get('[data-qa=add-strength-button]')

  private supportRecommendationsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=support-recommendations-summary-card] .govuk-summary-card__content')

  private addSupportRecommendationButton = (): PageElement => cy.get('[data-qa=add-support-recommendation-button]')

  private actionsCard = (): PageElement => cy.get('[data-qa=actions-card]')

  private educationSupportPlanActionItems = (): PageElement =>
    cy.get('[data-qa=education-support-plan-action-items] li')

  private createEducationSupportPlanButton = (): PageElement =>
    this.educationSupportPlanActionItems().find('[data-qa=create-education-support-plan-button]')

  private refuseEducationSupportPlanButton = (): PageElement =>
    this.educationSupportPlanActionItems().find('[data-qa=refuse-education-support-plan-button]')
}
