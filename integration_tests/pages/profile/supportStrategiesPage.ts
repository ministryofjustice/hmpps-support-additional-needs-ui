import Page, { PageElement } from '../page'
import ProfilePage from './profilePage'
import SelectSupportStrategyCategoryPage from '../support-strategies/selectSupportStrategyCategoryPage'
import SupportStrategyType from '../../../server/enums/supportStrategyType'

export default class SupportStrategiesPage extends ProfilePage {
  constructor() {
    super('profile-support-strategies')
    this.activeTabIs('Support strategies')
  }

  clickAddSupportStrategyButton(): SelectSupportStrategyCategoryPage {
    this.addSupportStrategyButton().click()
    return Page.verifyOnPage(SelectSupportStrategyCategoryPage)
  }

  private supportStrategiesActionItems = (): PageElement => cy.get('[data-qa=support-strategies-actions] li')

  private addSupportStrategyButton = (): PageElement =>
    this.supportStrategiesActionItems().find('[data-qa=add-support-strategy-button]')

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
}
