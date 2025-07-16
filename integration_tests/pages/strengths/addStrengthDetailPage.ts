import Page, { PageElement } from '../page'
import StrengthIdentificationSource from '../../../server/enums/strengthIdentificationSource'

export default class AddStrengthDetailPage extends Page {
  constructor() {
    super('create-strength-detail')
  }

  enterDescription(value: string): AddStrengthDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  enterOtherHowStrengthIdentified(value: string): AddStrengthDetailPage {
    this.otherIdentificationSourceField().clear().type(value, { delay: 0 })
    return this
  }

  selectHowStrengthIdentified(option: StrengthIdentificationSource): AddStrengthDetailPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectHowStrengthIdentified(option: StrengthIdentificationSource): AddStrengthDetailPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  private descriptionField = (): PageElement => cy.get('textarea[name=description]')

  private otherIdentificationSourceField = (): PageElement => cy.get('input[name=howIdentifiedOther]')

  private checkbox = (option: StrengthIdentificationSource): PageElement =>
    cy.get(`.govuk-checkboxes__input[value='${option}']`)
}
