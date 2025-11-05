import Page, { PageElement } from '../page'
import ConditionType from '../../../server/enums/conditionType'
import ConditionSource from '../../../server/enums/conditionSource'

export default class ConditionsDetailsPage extends Page {
  constructor() {
    super('conditions-details')
  }

  enterConditionDetails(conditionType: ConditionType, value: string): ConditionsDetailsPage {
    this.conditionDetailsField(conditionType).clear().type(value, { delay: 0 })
    return this
  }

  selectHowConditionWasDiagnosed(conditionType: ConditionType, source: ConditionSource): ConditionsDetailsPage {
    this.radioButton(conditionType, source).click()
    return this
  }

  private conditionDetailsField = (conditionType: ConditionType): PageElement => cy.get(`#${conditionType}_details`)

  private radioButton = (conditionType: ConditionType, value: ConditionSource): PageElement =>
    cy.get(`.govuk-radios__input[name='conditionDiagnosis[${conditionType}]'][value='${value}']`)
}
