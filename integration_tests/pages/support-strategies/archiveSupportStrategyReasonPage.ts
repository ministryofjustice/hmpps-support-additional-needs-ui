import Page, { PageElement } from '../page'

export default class ArchiveSupportStrategyReasonPage extends Page {
  constructor() {
    super('archive-support-strategy-reason')
  }

  enterReason(value: string): ArchiveSupportStrategyReasonPage {
    this.reasonField().clear().type(value, { delay: 0 })
    return this
  }

  clearReason(): ArchiveSupportStrategyReasonPage {
    this.reasonField().clear()
    return this
  }

  private reasonField = (): PageElement => cy.get('textarea[name=archiveReason]')
}
