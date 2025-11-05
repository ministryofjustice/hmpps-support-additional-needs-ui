import Page, { PageElement } from '../page'

export default class SupportStrategyDetailPage extends Page {
  constructor() {
    super('support-strategy-detail')
  }

  enterDescription(value: string): SupportStrategyDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  clearDescription(): SupportStrategyDetailPage {
    this.descriptionField().clear()
    return this
  }

  private descriptionField = (): PageElement => cy.get('textarea[name=description]')
}
