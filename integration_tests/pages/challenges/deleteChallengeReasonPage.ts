import Page, { PageElement } from '../page'
import DeleteReason from '../../../server/enums/deleteReason'

export default class DeleteChallengeReasonPage extends Page {
  constructor() {
    super('delete-challenge-reason')
  }

  selectReason(value: DeleteReason): DeleteChallengeReasonPage {
    this.reasonRadio(value).click()
    return this
  }

  private reasonRadio = (value: string): PageElement => cy.get(`input[name=deleteReason][value="${value}"]`)
}
