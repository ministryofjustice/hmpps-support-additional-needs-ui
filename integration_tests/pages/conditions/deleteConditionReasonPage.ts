import Page, { PageElement } from '../page'

export default class DeleteConditionReasonPage extends Page {
  constructor() {
    super('delete-condition-reason')
  }

  selectReason(value: 'DATA_PROCESSING_OBJECTION' | 'ENTERED_IN_ERROR'): DeleteConditionReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
