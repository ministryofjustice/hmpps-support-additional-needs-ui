import Page, { PageElement } from '../page'
import ProfilePage from './profilePage'
import SupportStrategyType from '../../../server/enums/supportStrategyType'
import SupportStrategyDetailPage from '../support-strategies/supportStrategyDetailPage'
import zeroIndexed from '../../utils/zeroIndexed'

export default class SupportStrategiesPage extends ProfilePage {
  constructor() {
    super('profile-support-strategies')
    this.activeTabIs('Support strategies')
  }

  clickToEditNthSupportStrategy(index: number): SupportStrategyDetailPage {
    this.supportStrategies().eq(zeroIndexed(index)).find('[data-qa=edit-support-strategy-button]').click()
    return Page.verifyOnPage(SupportStrategyDetailPage)
  }

  hasSupportStrategySummaryCard(category: SupportStrategyType): SupportStrategiesPage {
    this.supportStrategyCategorySummaryCard(category).should('be.visible')
    return this
  }

  hasNoActiveSupportStrategies(): SupportStrategiesPage {
    this.noSupportStrategiesSummaryCard().should('be.visible')
    return this
  }

  private noSupportStrategiesSummaryCard = (): PageElement => cy.get('[data-qa=no-support-strategies-summary-card]')

  private supportStrategyCategorySummaryCard = (category: SupportStrategyType): PageElement =>
    cy.get(`[data-qa=support-strategy-summary-card-${category}]`)

  private supportStrategies = (): PageElement => cy.get('[data-qa=support-strategy-summary-list-row]')
}
