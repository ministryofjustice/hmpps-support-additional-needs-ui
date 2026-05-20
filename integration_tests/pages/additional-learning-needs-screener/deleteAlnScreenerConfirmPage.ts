import Page, { PageElement } from '../page'

export default class DeleteAlnScreenerConfirmPage extends Page {
  constructor() {
    super('delete-aln-screener-confirm')
  }

  clickNoGoBackToOverview(): void {
    this.noDeleteLink().click()
  }

  private noDeleteLink = (): PageElement => cy.get('[data-qa=no-delete-link]')
}
