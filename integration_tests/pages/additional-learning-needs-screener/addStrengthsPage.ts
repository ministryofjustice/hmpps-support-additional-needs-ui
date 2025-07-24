import Page, { PageElement } from '../page'
import StrengthType from '../../../server/enums/strengthType'

export default class AddStrengthsPage extends Page {
  constructor() {
    super('record-aln-add-strengths')
  }

  selectStrength(option: StrengthType): AddStrengthsPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectStrength(option: StrengthType): AddStrengthsPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  private checkbox = (option: StrengthType): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)
}
