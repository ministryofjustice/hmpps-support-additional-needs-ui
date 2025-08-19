import Page, { PageElement } from '../page'
import ProfilePage from './profilePage'
import SelectSupportStrategyCategoryPage from '../support-strategies/selectSupportStrategyCategoryPage'

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
}
