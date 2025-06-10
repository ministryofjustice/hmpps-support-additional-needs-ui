import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class OtherPeopleConsultedPage extends Page {
  constructor() {
    super('education-support-plan-other-people-consulted')
  }

  selectOtherPeopleWereConsulted(): OtherPeopleConsultedPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectOtherPeopleWereNotConsulted(): OtherPeopleConsultedPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
