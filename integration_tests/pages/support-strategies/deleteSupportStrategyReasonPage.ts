import Page, { PageElement } from '../page'
import DeleteReason from '../../../server/enums/deleteReason'

export default class DeleteSupportStrategyReasonPage extends Page {
  constructor() {
    super('delete-support-strategy-reason')
  }

  selectReason(value: DeleteReason): DeleteSupportStrategyReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
