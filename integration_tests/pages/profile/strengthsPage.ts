import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import SelectStrengthCategoryPage from '../strengths/selectStrengthCategoryPage'

export default class StrengthsPage extends ProfilePage {
  constructor() {
    super('profile-strengths')
    this.activeTabIs('Strengths')
  }

  hasNoActiveStrengths(): StrengthsPage {
    this.noStrengthsSummaryCard().should('be.visible')
    return this
  }

  clickAddStrengthButton(): SelectStrengthCategoryPage {
    this.addStrengthButton().click()
    return Page.verifyOnPage(SelectStrengthCategoryPage)
  }

  private strengthsActionItems = (): PageElement => cy.get('[data-qa=strengths-action-items] li')

  private addStrengthButton = (): PageElement => this.strengthsActionItems().find('[data-qa=add-strength-button]')

  private noStrengthsSummaryCard = (): PageElement => cy.get('[data-qa=no-strengths-summary-card]')
}
