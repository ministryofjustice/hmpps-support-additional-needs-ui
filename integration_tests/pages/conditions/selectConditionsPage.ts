import Page, { PageElement } from '../page'
import ConditionType from '../../../server/enums/conditionType'

export default class SelectConditionsPage extends Page {
  constructor() {
    super('record-conditions-select-conditions')
  }

  selectCondition(option: ConditionType): SelectConditionsPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectCondition(option: ConditionType): SelectConditionsPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  specifyCondition(conditionType: ConditionType, value: string): SelectConditionsPage {
    this.conditionNamesField(conditionType).clear().type(value, { delay: 0 })
    return this
  }

  private checkbox = (value: ConditionType): PageElement => cy.get(`.govuk-checkboxes__input[value='${value}']`)

  private conditionNamesField = (conditionType: ConditionType): PageElement =>
    cy.get(`#${conditionType}_conditionNames`)
}
