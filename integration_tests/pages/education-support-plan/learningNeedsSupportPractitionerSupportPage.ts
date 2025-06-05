import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class LearningNeedsSupportPractitionerSupportPage extends Page {
  constructor() {
    super('education-support-plan-lnsp-support')
  }

  selectLnspSupportRequired(): LearningNeedsSupportPractitionerSupportPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectLnspSupportNotRequired(): LearningNeedsSupportPractitionerSupportPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  enterDetails(value: string): LearningNeedsSupportPractitionerSupportPage {
    this.detailsField().clear().type(value)
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private detailsField = (): PageElement => cy.get('textarea[name=details]')
}
