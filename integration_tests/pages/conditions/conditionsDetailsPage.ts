import Page, { PageElement } from '../page'
import ConditionType from '../../../server/enums/conditionType'

export default class ConditionsDetailsPage extends Page {
  constructor() {
    super('record-conditions-details')
  }

  enterConditionDetails(conditionType: ConditionType, value: string): ConditionsDetailsPage {
    this.conditionDetailsField(conditionType).clear().type(value, { delay: 0 })
    return this
  }

  private conditionDetailsField = (conditionType: ConditionType): PageElement => cy.get(`#${conditionType}_details`)
}
