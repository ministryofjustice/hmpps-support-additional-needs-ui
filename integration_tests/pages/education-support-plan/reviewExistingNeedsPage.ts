import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

export default class ReviewExistingNeedsPage extends Page {
  constructor() {
    super('education-support-plan-review-existing-needs')
  }

  selectReviewExistingNeeds(): ReviewExistingNeedsPage {
    this.radio(YesNoValue.YES).click()
    return this
  }

  selectDoNotReviewExistingNeeds(): ReviewExistingNeedsPage {
    this.radio(YesNoValue.NO).click()
    return this
  }

  private radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
