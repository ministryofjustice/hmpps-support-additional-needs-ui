import Page, { PageElement } from '../page'
import ConditionSource from '../../../server/enums/conditionSource'

export default class EditConditionDetailPage extends Page {
  constructor() {
    super('condition-detail')
  }

  enterConditionDetails(value: string): EditConditionDetailPage {
    this.conditionDetailsField().clear().type(value, { delay: 0 })
    return this
  }

  clearConditionDetails(): EditConditionDetailPage {
    this.conditionDetailsField().clear()
    return this
  }

  selectHowConditionWasDiagnosed(source: ConditionSource): EditConditionDetailPage {
    this.radioButton(source).click()
    return this
  }

  private conditionDetailsField = (): PageElement => cy.get('textarea[name=conditionDetails]')

  private radioButton = (value: ConditionSource): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
