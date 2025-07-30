import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import SelectConditionsPage from '../conditions/selectConditionsPage'

export default class ConditionsPage extends ProfilePage {
  constructor() {
    super('profile-conditions')
    this.activeTabIs('Conditions')
  }

  clickRecordConditionsButton(): SelectConditionsPage {
    this.recordConditionsButton().click()
    return Page.verifyOnPage(SelectConditionsPage)
  }

  private conditionsActionItems = (): PageElement => cy.get('[data-qa=conditions-actions] li')

  private recordConditionsButton = (): PageElement =>
    this.conditionsActionItems().find('[data-qa=record-conditions-button]')
}
