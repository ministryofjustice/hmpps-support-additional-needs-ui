import Page, { PageElement } from '../page'

export default class ReviewersViewOnProgressPage extends Page {
  constructor() {
    super('education-support-plan-reviewers-view-on-progress')
  }

  enterReviewersViewOnProgress(value: string): ReviewersViewOnProgressPage {
    this.reviewersViewOnProgressField().clear().type(value, { delay: 0 })
    return this
  }

  clearReviewersViewOnProgress(): ReviewersViewOnProgressPage {
    this.reviewersViewOnProgressField().clear()
    return this
  }

  private reviewersViewOnProgressField = (): PageElement => cy.get('textarea[name=reviewersViewOnProgress]')
}
