import Page, { PageElement } from '../page'

export default class ArchiveConditionReasonPage extends Page {
  constructor() {
    super('archive-condition-reason')
  }

  enterReason(value: string): ArchiveConditionReasonPage {
    this.reasonField().clear().type(value, { delay: 0 })
    return this
  }

  clearReason(): ArchiveConditionReasonPage {
    this.reasonField().clear()
    return this
  }

  private reasonField = (): PageElement => cy.get('textarea[name=archiveReason]')
}
