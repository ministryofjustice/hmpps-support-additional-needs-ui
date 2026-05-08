import Page, { PageElement } from '../page'

export default class DeleteChallengeReasonPage extends Page {
  constructor() {
    super('delete-challenge-reason')
  }

  selectReason(value: 'DATA_PROCESSING_OBJECTION' | 'ENTERED_IN_ERROR'): DeleteChallengeReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
