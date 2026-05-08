import Page, { PageElement } from '../page'

export default class DeleteChallengeConfirmPage extends Page {
  constructor() {
    super('delete-challenge-confirm')
  }

  clickNoGoBackToOverview(): void {
    this.noDeleteLink().click()
  }

  private noDeleteLink = (): PageElement => cy.get('[data-qa=no-delete-link]')
}
