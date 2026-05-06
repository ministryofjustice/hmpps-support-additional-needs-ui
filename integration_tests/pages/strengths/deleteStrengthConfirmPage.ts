import Page, { PageElement } from '../page'

export default class DeleteStrengthConfirmPage extends Page {
  constructor() {
    super('delete-strength-confirm')
  }

  clickNoGoBackToOverview(): void {
    this.noDeleteLink().click()
  }

  private noDeleteLink = (): PageElement => cy.get('[data-qa=no-delete-link]')
}
