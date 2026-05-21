import Page, { PageElement } from '../page'
import DeleteReason from '../../../server/enums/deleteReason'

export default class DeleteAlnScreenerReasonPage extends Page {
  constructor() {
    super('delete-aln-screener-reason')
  }

  selectReason(value: DeleteReason): DeleteAlnScreenerReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
