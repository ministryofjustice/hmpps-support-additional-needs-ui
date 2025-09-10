import { PageElement } from '../page'
// eslint ignore-next-line import/no-cycle
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

  hasSupportStrategiesUnavailableMessage(): OverviewPage {
    this.supportStrategiesUnavailableMessage().should('be.visible')
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

  hasNoSupportStrategiesRecorded(): OverviewPage {
    this.supportStrategiesSummaryCardContent().should('contain', 'No support strategies recorded')
    return this
  }

  hasChallengesUnavailableMessage(): OverviewPage {
    this.challengesUnavailableMessage().should('be.visible')
    return this
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

  private supportStrategiesUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=support-strategies-unavailable-message]')

  private supportStrategiesSummaryCardContent = (): PageElement =>
    cy.get('[data-qa=support-strategies-summary-card] .govuk-summary-card__content')

  private challengesUnavailableMessage = (): PageElement => cy.get('[data-qa=challenges-unavailable-message]')
}
