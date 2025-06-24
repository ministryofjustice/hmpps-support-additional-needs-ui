import Page, { PageElement } from '../page'

export default class ReviewSupportPlanPage extends Page {
  constructor() {
    super('education-support-plan-review-support-plan')
  }

  setReviewDate(reviewDate: string): ReviewSupportPlanPage {
    this.reviewDateField().clear().type(reviewDate, { delay: 0 })
    return this
  }

  private reviewDateField = (): PageElement => cy.get('#reviewDate')
}
