import Page, { PageElement } from '../page'

export default class DeleteSupportStrategyConfirmPage extends Page {
  constructor() {
    super('delete-support-strategy-confirm')
  }

  clickNoGoBackToOverview(): void {
    this.noDeleteLink().click()
  }

  private noDeleteLink = (): PageElement => cy.get('[data-qa=no-delete-link]')
}
