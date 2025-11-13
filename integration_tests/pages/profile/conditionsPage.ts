import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import ConditionType from '../../../server/enums/conditionType'
import zeroIndexed from '../../utils/zeroIndexed'
import EditConditionDetailPage from '../conditions/editConditionDetailPage'
import ArchiveConditionReasonPage from '../conditions/archiveConditionReasonPage'

export default class ConditionsPage extends ProfilePage {
  constructor() {
    super('profile-conditions')
    this.activeTabIs('Conditions')
  }

  clickToEditNthCondition(index: number): EditConditionDetailPage {
    this.activeConditions().eq(zeroIndexed(index)).find('[data-qa=edit-condition-button]').click()
    return Page.verifyOnPage(EditConditionDetailPage)
  }

  clickToArchiveNthCondition(index: number): ArchiveConditionReasonPage {
    this.activeConditions().eq(zeroIndexed(index)).find('[data-qa=archive-condition-button]').click()
    return Page.verifyOnPage(ArchiveConditionReasonPage)
  }

  hasActiveDiagnosedConditions(...conditions: Array<ConditionType>): ConditionsPage {
    this.diagnosedConditionsSummaryCard({ active: true }).should('be.visible')
    this.diagnosedConditionsSummaryCard({ active: true })
      .find('.govuk-summary-list__row')
      .should('have.length', conditions.length)
    conditions.forEach(condition => {
      this.diagnosedConditionsSummaryCard({ active: true })
        .find(`.govuk-summary-list__row[data-qa=${condition}]`)
        .should('be.visible')
    })
    this.noConditionsMessage({ active: true }).should('not.exist')
    return this
  }

  hasArchivedDiagnosedConditions(...conditions: Array<ConditionType>): ConditionsPage {
    this.diagnosedConditionsSummaryCard({ active: false }).should('be.visible')
    this.diagnosedConditionsSummaryCard({ active: false })
      .find('.govuk-summary-list__row')
      .should('have.length', conditions.length)
    conditions.forEach(condition => {
      this.diagnosedConditionsSummaryCard({ active: false })
        .find(`.govuk-summary-list__row[data-qa=${condition}]`)
        .should('be.visible')
    })
    this.noConditionsMessage({ active: false }).should('not.exist')
    return this
  }

  hasActiveSelfDeclaredConditions(...conditions: Array<ConditionType>): ConditionsPage {
    this.selfDeclaredConditionsSummaryCard({ active: true }).should('be.visible')
    this.selfDeclaredConditionsSummaryCard({ active: true })
      .find('.govuk-summary-list__row')
      .should('have.length', conditions.length)
    conditions.forEach(condition => {
      this.selfDeclaredConditionsSummaryCard({ active: true })
        .find(`.govuk-summary-list__row[data-qa=${condition}]`)
        .should('be.visible')
    })
    this.noConditionsMessage({ active: true }).should('not.exist')
    return this
  }

  hasArchivedSelfDeclaredConditions(...conditions: Array<ConditionType>): ConditionsPage {
    this.selfDeclaredConditionsSummaryCard({ active: false }).should('be.visible')
    this.selfDeclaredConditionsSummaryCard({ active: false })
      .find('.govuk-summary-list__row')
      .should('have.length', conditions.length)
    conditions.forEach(condition => {
      this.selfDeclaredConditionsSummaryCard({ active: false })
        .find(`.govuk-summary-list__row[data-qa=${condition}]`)
        .should('be.visible')
    })
    this.noConditionsMessage({ active: false }).should('not.exist')
    return this
  }

  hasNoActiveConditions(): ConditionsPage {
    this.noConditionsMessage({ active: true }).should('be.visible')
    this.selfDeclaredConditionsSummaryCard({ active: true }).should('not.exist')
    this.diagnosedConditionsSummaryCard({ active: true }).should('not.exist')
    return this
  }

  hasNoArchivedConditions(): ConditionsPage {
    this.noConditionsMessage({ active: false }).should('be.visible')
    this.selfDeclaredConditionsSummaryCard({ active: false }).should('not.exist')
    this.diagnosedConditionsSummaryCard({ active: false }).should('not.exist')
    return this
  }

  private diagnosedConditionsSummaryCard = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=${options.active ? 'active' : 'archived'}-diagnosed-conditions-summary-card]`)

  private selfDeclaredConditionsSummaryCard = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=${options.active ? 'active' : 'archived'}-self-declared-conditions-summary-card]`)

  private noConditionsMessage = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=no-${options.active ? 'active' : 'archived'}-conditions-message]`)

  private activeConditions = (): PageElement =>
    cy.get(
      `[data-qa=active-diagnosed-conditions-summary-card] .govuk-summary-list__row, [data-qa=active-self-declared-conditions-summary-card] .govuk-summary-list__row`,
    )
}
