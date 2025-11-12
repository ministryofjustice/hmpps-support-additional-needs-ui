import Page, { PageElement } from '../page'

export default class ArchiveChallengeReasonPage extends Page {
  constructor() {
    super('archive-challenge-reason')
  }

  enterReason(value: string): ArchiveChallengeReasonPage {
    this.reasonField().clear().type(value, { delay: 0 })
    return this
  }

  clearReason(): ArchiveChallengeReasonPage {
    this.reasonField().clear()
    return this
  }

  private reasonField = (): PageElement => cy.get('textarea[name=archiveReason]')
}
