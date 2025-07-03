import Page, { PageElement } from '../page'

export default class IndividualSupportRequirementsPage extends Page {
  constructor() {
    super('education-support-plan-individual-support-requirements')
  }

  enterSupportRequirements(value: string): IndividualSupportRequirementsPage {
    this.supportRequirementsField().clear().type(value, { delay: 0 })
    return this
  }

  private supportRequirementsField = (): PageElement => cy.get('textarea[name=supportRequirements]')
}
