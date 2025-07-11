import Page, { PageElement } from '../page'

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

  private tabBarLink = (targetTab: string): PageElement => cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`)

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private prisonerSummaryBanner = (): PageElement => cy.get('.prisoner-summary-banner')

  private successMessage = (): PageElement => cy.get('[data-qa=success-message]')
}
