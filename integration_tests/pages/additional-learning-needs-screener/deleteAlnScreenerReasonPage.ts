import Page, { PageElement } from '../page'

export default class DeleteAlnScreenerReasonPage extends Page {
  constructor() {
    super('delete-aln-screener-reason')
  }

  selectReason(value: 'DATA_PROCESSING_OBJECTION' | 'ENTERED_IN_ERROR'): DeleteAlnScreenerReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
