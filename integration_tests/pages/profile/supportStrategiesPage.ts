import Page, { PageElement } from '../page'
import ProfilePage from './profilePage'
import SupportStrategyType from '../../../server/enums/supportStrategyType'
import SupportStrategyDetailPage from '../support-strategies/supportStrategyDetailPage'
import zeroIndexed from '../../utils/zeroIndexed'
import ArchiveSupportStrategyReasonPage from '../support-strategies/archiveSupportStrategyReasonPage'

export default class SupportStrategiesPage extends ProfilePage {
  constructor() {
    super('profile-support-strategies')
    this.activeTabIs('Support strategies')
  }

  clickToEditNthSupportStrategy(index: number): SupportStrategyDetailPage {
    this.supportStrategies().eq(zeroIndexed(index)).find('[data-qa=edit-support-strategy-button]').click()
    return Page.verifyOnPage(SupportStrategyDetailPage)
  }

  clickToArchiveNthSupportStrategy(index: number): ArchiveSupportStrategyReasonPage {
    this.supportStrategies().eq(zeroIndexed(index)).find('[data-qa=archive-support-strategy-button]').click()
    return Page.verifyOnPage(ArchiveSupportStrategyReasonPage)
  }

  hasActiveSupportStrategySummaryCard(category: SupportStrategyType): SupportStrategiesPage {
    this.supportStrategyCategorySummaryCard({ category, active: true }).should('be.visible')
    return this
  }

  hasNoActiveSupportStrategies(): SupportStrategiesPage {
    this.noSupportStrategiesMessage({ active: true }).should('be.visible')
    return this
  }

  private noSupportStrategiesMessage = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=no-${options.active ? 'active' : 'archived'}-support-strategies-message]`)

  private supportStrategyCategorySummaryCard = (options: {
    category: SupportStrategyType
    active: boolean
  }): PageElement =>
    cy.get(`[data-qa=${options.active ? 'active' : 'archived'}-support-strategy-summary-card_${options.category}]`)

  private supportStrategies = (): PageElement => cy.get('.govuk-summary-list__row.support-strategy')
}
