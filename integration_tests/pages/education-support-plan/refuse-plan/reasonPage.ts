import Page, { PageElement } from '../../page'
import PlanCreationScheduleExemptionReason from '../../../../server/enums/planCreationScheduleExemptionReason'

export default class ReasonPage extends Page {
  constructor() {
    super('refuse-education-support-plan-reason')
  }

  selectReason(value: PlanCreationScheduleExemptionReason): ReasonPage {
    this.radio(value).click()
    return this
  }

  enterDetails(details: string): ReasonPage {
    this.selectedRadio().then(radio => {
      const reason = radio.val()
      this.detailsField(reason as string)
        .clear()
        .type(details, { delay: 0 })
    })
    return this
  }

  private radio = (value: PlanCreationScheduleExemptionReason): PageElement =>
    cy.get(`.govuk-radios__input[value='${value}']`)

  private selectedRadio = (): PageElement => cy.get(`.govuk-radios__input:checked`)

  private detailsField = (value: string): PageElement => cy.get(`#${value}_refusalDetails`)
}
