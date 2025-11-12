import Page, { PageElement } from '../page'

export default class ArchiveStrengthReasonPage extends Page {
  constructor() {
    super('archive-strength-reason')
  }

  enterReason(value: string): ArchiveStrengthReasonPage {
    this.reasonField().clear().type(value, { delay: 0 })
    return this
  }

  clearReason(): ArchiveStrengthReasonPage {
    this.reasonField().clear()
    return this
  }

  private reasonField = (): PageElement => cy.get('textarea[name=archiveReason]')
}
