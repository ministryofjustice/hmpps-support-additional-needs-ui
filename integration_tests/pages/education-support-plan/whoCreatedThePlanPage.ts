import Page, { PageElement } from '../page'
import PlanCreatedByValue from '../../../server/enums/planCreatedByValue'

export default class WhoCreatedThePlanPage extends Page {
  constructor() {
    super('education-support-plan-who-created-the-plan')
  }

  selectWhoCreatedThePlan(value: PlanCreatedByValue): WhoCreatedThePlanPage {
    this.radio(value).click()
    return this
  }

  enterFullName(value: string): WhoCreatedThePlanPage {
    this.fullNameField().clear().type(value, { delay: 0 })
    return this
  }

  enterJobRole(value: string): WhoCreatedThePlanPage {
    this.jobRoleField().clear().type(value, { delay: 0 })
    return this
  }

  private radio = (value: PlanCreatedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private fullNameField = (): PageElement => cy.get('[data-qa=completedByOtherFullName]')

  private jobRoleField = (): PageElement => cy.get('[data-qa=completedByOtherJobRole]')
}
