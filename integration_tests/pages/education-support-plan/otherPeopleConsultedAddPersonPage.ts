import Page, { PageElement } from '../page'

export default class OtherPeopleConsultedAddPersonPage extends Page {
  constructor() {
    super('education-support-plan-other-people-consulted-add-person')
  }

  enterFullName(value: string): OtherPeopleConsultedAddPersonPage {
    this.fullNameField().clear().type(value, { delay: 0 })
    return this
  }

  private fullNameField = (): PageElement => cy.get('[data-qa=fullName]')
}
