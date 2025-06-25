import Page, { PageElement } from '../page'

export default class AdditionalInformationPage extends Page {
  constructor() {
    super('education-support-plan-additional-information')
  }

  enterAdditionalInformation(value: string): AdditionalInformationPage {
    this.clearAdditionalInformation()
    this.additionalInformationField().type(value, { delay: 0 })
    return this
  }

  clearAdditionalInformation(): AdditionalInformationPage {
    this.additionalInformationField().clear()
    return this
  }

  private additionalInformationField = (): PageElement => cy.get('textarea[name=additionalInformation]')
}
