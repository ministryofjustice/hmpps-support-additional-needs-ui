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
    this.hasNoAlnAssessmentsRecorded()
    this.hasNoLddAssessmentsRecorded()
    return this
  }

  hasNoAlnAssessmentsRecorded(): OverviewPage {
    this.alnAssessments().should('not.exist')
    return this
  }

  hasAlnAssessmentsRecorded(): OverviewPage {
    this.alnAssessments().should('be.visible')
    return this
  }

  hasNoLddAssessmentsRecorded(): OverviewPage {
    this.lddAssessments().should('not.exist')
    return this
  }

  hasLddAssessmentsRecorded(): OverviewPage {
    this.lddAssessments().should('be.visible')
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

  hasChallengesUnavailableMessage(): OverviewPage {
    this.challengesUnavailableMessage().should('be.visible')
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

  private alnAssessments = (): PageElement => cy.get('[data-qa=aln-assessments]')

  private lddAssessments = (): PageElement => cy.get('[data-qa=ldd-assessments]')

  private curiousScreenersUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=curious-screeners-unavailable-message]')

  private conditionsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=conditions-summary-card] .govuk-summary-card__content')

  private conditionsUnavailableMessage = (): PageElement => cy.get('[data-qa=conditions-unavailable-message]')

  private strengthsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=strengths-summary-card] .govuk-summary-card__content')

  private strengthsUnavailableMessage = (): PageElement => cy.get('[data-qa=strengths-unavailable-message]')

  private supportRecommendationsSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=support-recommendations-summary-card] .govuk-summary-card__content')

  private actionsCard = (): PageElement => cy.get('[data-qa=actions-card]')

  private educationSupportPlanActionItems = (): PageElement =>
    cy.get('[data-qa=education-support-plan-action-items] li')

  private createEducationSupportPlanButton = (): PageElement =>
    this.educationSupportPlanActionItems().find('[data-qa=create-education-support-plan-button]')

  private refuseEducationSupportPlanButton = (): PageElement =>
    this.educationSupportPlanActionItems().find('[data-qa=refuse-education-support-plan-button]')

  private challengesUnavailableMessage = (): PageElement => cy.get('[data-qa=challenges-unavailable-message]')
}
