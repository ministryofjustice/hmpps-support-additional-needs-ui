import Page, { PageElement } from '../page'
import SelectChallengeCategoryPage from '../challenges/selectChallengeCategoryPage'
import ScreenerDatePage from '../additional-learning-needs-screener/screenerDatePage'
import SelectConditionsPage from '../conditions/selectConditionsPage'
import SelectStrengthCategoryPage from '../strengths/selectStrengthCategoryPage'

export default abstract class ProfilePage extends Page {
  hasSuccessMessage<T extends ProfilePage>(message: string): T {
    this.successMessage() //
      .should('be.visible')
      .and('contain.text', message)
    return this as unknown as T
  }

  doesNotHaveSuccessMessage<T extends ProfilePage>(): T {
    this.successMessage().should('not.exist')
    return this as unknown as T
  }

  selectTab<T extends ProfilePage>(targetTab: string, constructor: new () => T): T {
    this.tabBarLink(targetTab).click()
    return Page.verifyOnPage(constructor)
  }

  activeTabIs<T extends ProfilePage>(expected: string): T {
    this.activeTab().should('contain.text', expected)
    return this as unknown as T
  }

  clickAddChallengesButton(): SelectChallengeCategoryPage {
    this.addChallengeButton().click()
    return Page.verifyOnPage(SelectChallengeCategoryPage)
  }

  clickRecordAlnScreenerButton(): ScreenerDatePage {
    this.recordAlnScreenerButton().click()
    return Page.verifyOnPage(ScreenerDatePage)
  }

  clickAddConditionsButton(): SelectConditionsPage {
    this.addConditionsButton().click()
    return Page.verifyOnPage(SelectConditionsPage)
  }

  clickAddStrengthButton(): SelectStrengthCategoryPage {
    this.addStrengthButton().click()
    return Page.verifyOnPage(SelectStrengthCategoryPage)
  }

  private tabBarLink = (targetTab: string): PageElement => cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`)

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private prisonerSummaryBanner = (): PageElement => cy.get('.prisoner-summary-banner')

  private successMessage = (): PageElement => cy.get('[data-qa=success-message]')

  private addChallengeButton = (): PageElement => cy.get('[data-qa=add-challenge-button]')

  private recordAlnScreenerButton = (): PageElement => cy.get('[data-qa=record-screener-results-button]')

  private addConditionsButton = (): PageElement => cy.get('[data-qa=add-conditions-button]')

  private addStrengthButton = (): PageElement => cy.get('[data-qa=add-strength-button]')
}
