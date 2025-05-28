import Page, { PageElement } from '../../page'

export default class OverviewPage extends Page {
  constructor() {
    super('profile-overview')
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

  private prisonerSummaryBanner = (): PageElement => cy.get('.prisoner-summary-banner')

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
}
