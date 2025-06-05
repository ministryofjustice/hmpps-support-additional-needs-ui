import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class EducationHealthCarePlanPage extends Page {
  constructor() {
    super('education-support-plan-ehcp')
  }

  selectHasCurrentEhcp(): EducationHealthCarePlanPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectDoesNotHaveCurrentEhcp(): EducationHealthCarePlanPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
