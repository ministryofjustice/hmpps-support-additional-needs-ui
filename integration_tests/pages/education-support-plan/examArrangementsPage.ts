import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class ExamArrangementsPage extends Page {
  constructor() {
    super('education-support-plan-exam-arrangements')
  }

  selectExamArrangementsRequired(): ExamArrangementsPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectExamArrangementsNotRequired(): ExamArrangementsPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  enterDetails(value: string): ExamArrangementsPage {
    this.detailsField().clear().type(value, { delay: 0 })
    return this
  }

  clearDetails(): ExamArrangementsPage {
    this.detailsField().clear()
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private detailsField = (): PageElement => cy.get('textarea[name=details]')
}
