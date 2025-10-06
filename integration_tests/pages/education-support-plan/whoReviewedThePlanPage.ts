import Page, { PageElement } from '../page'
import PlanReviewedByValue from '../../../server/enums/planReviewedByValue'

export default class WhoReviewedThePlanPage extends Page {
  constructor() {
    super('education-support-plan-who-reviewed-the-plan')
  }

  selectWhoReviewedThePlan(value: PlanReviewedByValue): WhoReviewedThePlanPage {
    this.radio(value).click()
    return this
  }

  enterFullName(value: string): WhoReviewedThePlanPage {
    this.fullNameField().clear().type(value, { delay: 0 })
    return this
  }

  enterJobRole(value: string): WhoReviewedThePlanPage {
    this.jobRoleField().clear().type(value, { delay: 0 })
    return this
  }

  private radio = (value: PlanReviewedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private fullNameField = (): PageElement => cy.get('[data-qa=reviewedByOtherFullName]')

  private jobRoleField = (): PageElement => cy.get('[data-qa=reviewedByOtherJobRole]')
}
