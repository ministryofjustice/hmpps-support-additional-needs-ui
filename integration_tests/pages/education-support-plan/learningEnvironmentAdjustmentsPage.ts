import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class LearningEnvironmentAdjustmentsPage extends Page {
  constructor() {
    super('education-support-plan-learning-environment-adjustments')
  }

  selectLearningAdjustmentsRequired(): LearningEnvironmentAdjustmentsPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectLearningAdjustmentsNotRequired(): LearningEnvironmentAdjustmentsPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  enterDetails(value: string): LearningEnvironmentAdjustmentsPage {
    this.detailsField().clear().type(value)
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private detailsField = (): PageElement => cy.get('textarea[name=details]')
}
