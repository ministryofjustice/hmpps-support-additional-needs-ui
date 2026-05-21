import Page, { PageElement } from '../page'
import DeleteReason from '../../../server/enums/deleteReason'

export default class DeleteStrengthReasonPage extends Page {
  constructor() {
    super('delete-strength-reason')
  }

  selectReason(value: DeleteReason): DeleteStrengthReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
