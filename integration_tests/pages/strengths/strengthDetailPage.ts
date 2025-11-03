import Page, { PageElement } from '../page'
import StrengthIdentificationSource from '../../../server/enums/strengthIdentificationSource'

export default class StrengthDetailPage extends Page {
  constructor() {
    super('strength-detail')
  }

  enterDescription(value: string): StrengthDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  enterOtherHowStrengthIdentified(value: string): StrengthDetailPage {
    this.otherIdentificationSourceField().clear().type(value, { delay: 0 })
    return this
  }

  selectHowStrengthIdentified(option: StrengthIdentificationSource): StrengthDetailPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectHowStrengthIdentified(option: StrengthIdentificationSource): StrengthDetailPage {
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
