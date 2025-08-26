import Page, { PageElement } from '../page'
import WhoCreatedThePlanPage from '../education-support-plan/whoCreatedThePlanPage'
import ReasonPage from '../education-support-plan/refuse-plan/reasonPage'
import ProfilePage from './profilePage'

export default class OverviewPage extends ProfilePage {
  constructor() {
    super('profile-overview')
    this.activeTabIs('Overview')
  }

  hasNoScreeningAndAssessmentsRecorded(): OverviewPage {
    this.screeningAndAssessmentSummaryCardContent().should('contain', 'No additional learning needs screener recorded')
    return this
  }

  hasCuriousScreenersUnavailableMessage(): OverviewPage {
    this.curiousScreenersUnavailableMessage().should('be.visible')
    return this
  }

  hasNoStrengthsRecorded(): OverviewPage {
    this.strengthsSummaryCardContent().should('contain', 'No strengths recorded')
    this.strengthsUnavailableMessage().should('not.exist')
    return this
  }

  hasStrengthsRecorded(...expected: Array<string>): OverviewPage {
    this.strengthsSummaryCardContent()
      .find('li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', expected.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', expected[index])
        })
      })
    this.strengthsUnavailableMessage().should('not.exist')
    return this
  }

  hasConditionsUnavailableMessage(): OverviewPage {
    this.conditionsUnavailableMessage().should('be.visible')
    return this
  }

  hasNoConditionsRecorded(): OverviewPage {
    this.conditionsSummaryCardContent().should('contain', 'No conditions recorded')
    this.conditionsUnavailableMessage().should('not.exist')
    return this
  }

  hasConditionsRecorded(...expected: Array<string>): OverviewPage {
    this.conditionsSummaryCardContent()
      .find('.govuk-summary-list__row')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', expected.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', expected[index])
        })
      })
    this.conditionsUnavailableMessage().should('not.exist')
    return this
  }

  hasStrengthsUnavailableMessage(): OverviewPage {
    this.strengthsUnavailableMessage().should('be.visible')
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

  private screeningAndAssessmentSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=screening-and-assessment-summary-card] .govuk-summary-card__content')

  private curiousScreenersUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=curious-screeners-unavailable-message]')

  private recordAlnScreenerButton = (): PageElement => cy.get('[data-qa=record-screener-results-button]')

  private conditionsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=conditions-summary-card] .govuk-summary-card__content')

  private conditionsUnavailableMessage = (): PageElement => cy.get('[data-qa=conditions-unavailable-message]')

  private addConditionButton = (): PageElement => cy.get('[data-qa=add-condition-button]')

  private strengthsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=strengths-summary-card] .govuk-summary-card__content')

  private strengthsUnavailableMessage = (): PageElement => cy.get('[data-qa=strengths-unavailable-message]')

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
