import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import SelectConditionsPage from '../conditions/selectConditionsPage'
import ConditionType from '../../../server/enums/conditionType'

export default class ConditionsPage extends ProfilePage {
  constructor() {
    super('profile-conditions')
    this.activeTabIs('Conditions')
  }

  hasDiagnosedConditions(...conditions: Array<ConditionType>): ConditionsPage {
    this.diagnosedConditionsSummaryCard().should('be.visible')
    this.diagnosedConditionsSummaryCard().find('.govuk-summary-list__row').should('have.length', conditions.length)
    conditions.forEach(condition => {
      this.diagnosedConditionsSummaryCard().find(`.govuk-summary-list__row[data-qa=${condition}]`).should('be.visible')
    })
    this.noConditionsSummaryCard().should('not.exist')
    return this
  }

  hasSelfDeclaredConditions(...conditions: Array<ConditionType>): ConditionsPage {
    this.selfDeclaredConditionsSummaryCard().should('be.visible')
    this.selfDeclaredConditionsSummaryCard().find('.govuk-summary-list__row').should('have.length', conditions.length)
    conditions.forEach(condition => {
      this.selfDeclaredConditionsSummaryCard()
        .find(`.govuk-summary-list__row[data-qa=${condition}]`)
        .should('be.visible')
    })
    this.noConditionsSummaryCard().should('not.exist')
    return this
  }

  hasNoActiveConditions(): ConditionsPage {
    this.noConditionsSummaryCard().should('be.visible')
    this.selfDeclaredConditionsSummaryCard().should('not.exist')
    this.diagnosedConditionsSummaryCard().should('not.exist')
    return this
  }

  clickRecordConditionsButton(): SelectConditionsPage {
    this.recordConditionsButton().click()
    return Page.verifyOnPage(SelectConditionsPage)
  }

  private conditionsActionItems = (): PageElement => cy.get('[data-qa=conditions-actions] li')

  private recordConditionsButton = (): PageElement =>
    this.conditionsActionItems().find('[data-qa=record-conditions-button]')

  private diagnosedConditionsSummaryCard = (): PageElement => cy.get('[data-qa=diagnosed-conditions-summary-card]')

  private selfDeclaredConditionsSummaryCard = (): PageElement =>
    cy.get('[data-qa=self-declared-conditions-summary-card]')

  private noConditionsSummaryCard = (): PageElement => cy.get('[data-qa=no-conditions-summary-card]')
}
