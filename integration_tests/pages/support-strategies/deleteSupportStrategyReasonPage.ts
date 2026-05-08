import Page, { PageElement } from '../page'

export default class DeleteSupportStrategyReasonPage extends Page {
  constructor() {
    super('delete-support-strategy-reason')
  }

  selectReason(value: 'DATA_PROCESSING_OBJECTION' | 'ENTERED_IN_ERROR'): DeleteSupportStrategyReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
