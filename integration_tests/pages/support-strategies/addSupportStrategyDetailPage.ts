import Page, { PageElement } from '../page'

export default class AddSupportStrategyDetailPage extends Page {
  constructor() {
    super('create-support-strategy-detail')
  }

  enterDescription(value: string): AddSupportStrategyDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  private descriptionField = (): PageElement => cy.get('textarea[name=description]')
}
