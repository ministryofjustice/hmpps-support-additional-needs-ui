import Page, { PageElement } from '../page'
import SupportStrategyType from '../../../server/enums/supportStrategyType'

export default class SelectSupportStrategyCategoryPage extends Page {
  constructor() {
    super('create-support-strategy-select-category')
  }

  selectCategory(value: SupportStrategyType): SelectSupportStrategyCategoryPage {
    this.radioButton(value).click()
    return this
  }

  private radioButton = (value: SupportStrategyType): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
