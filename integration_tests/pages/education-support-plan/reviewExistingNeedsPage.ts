import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class ReviewExistingNeedsPage extends Page {
  constructor() {
    super('education-support-plan-review-existing-needs')
  }

  selectExistingNeedsReviewed(): ReviewExistingNeedsPage {
    this.checkbox(YesNoValue.YES).click()
    return this
  }

  private checkbox = (value: YesNoValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${value}']`)
}
