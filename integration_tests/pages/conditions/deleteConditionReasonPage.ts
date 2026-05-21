import Page, { PageElement } from '../page'
import DeleteReason from '../../../server/enums/deleteReason'

export default class DeleteConditionReasonPage extends Page {
  constructor() {
    super('delete-condition-reason')
  }

  selectReason(value: DeleteReason): DeleteConditionReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
