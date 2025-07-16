import Page, { PageElement } from '../page'
import StrengthCategory from '../../../server/enums/strengthCategory'

export default class SelectStrengthCategoryPage extends Page {
  constructor() {
    super('create-strength-select-category')
  }

  selectCategory(value: StrengthCategory): SelectStrengthCategoryPage {
    this.radioButton(value).click()
    return this
  }

  private radioButton = (value: StrengthCategory): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
