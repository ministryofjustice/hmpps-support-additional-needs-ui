import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class SpecificTeachingSkillsPage extends Page {
  constructor() {
    super('education-support-plan-specific-teaching-skills')
  }

  selectSpecificTeachingSkillsRequired(): SpecificTeachingSkillsPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectSpecificTeachingSkillsNotRequired(): SpecificTeachingSkillsPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  enterDetails(value: string): SpecificTeachingSkillsPage {
    this.detailsField().clear().type(value, { delay: 0 })
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private detailsField = (): PageElement => cy.get('textarea[name=details]')
}
