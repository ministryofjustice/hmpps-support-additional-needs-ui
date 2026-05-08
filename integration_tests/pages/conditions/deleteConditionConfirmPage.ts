import Page, { PageElement } from '../page'

export default class DeleteConditionConfirmPage extends Page {
  constructor() {
    super('delete-condition-confirm')
  }

  clickNoGoBackToOverview(): void {
    this.noDeleteLink().click()
  }

  private noDeleteLink = (): PageElement => cy.get('[data-qa=no-delete-link]')
}
