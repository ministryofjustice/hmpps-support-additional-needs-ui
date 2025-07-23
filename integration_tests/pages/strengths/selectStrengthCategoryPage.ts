import Page, { PageElement } from '../page'
import StrengthType from '../../../server/enums/strengthType'

export default class SelectStrengthCategoryPage extends Page {
  constructor() {
    super('create-strength-select-category')
  }

  selectCategory(value: StrengthType): SelectStrengthCategoryPage {
    this.radioButton(value).click()
    return this
  }

  private radioButton = (value: StrengthType): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
