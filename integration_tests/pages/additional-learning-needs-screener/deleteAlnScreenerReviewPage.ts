import Page, { PageElement } from '../page'

export default class DeleteAlnScreenerReviewPage extends Page {
  constructor() {
    super('delete-aln-screener-review')
  }

  hasChallengeCategory(category: string): DeleteAlnScreenerReviewPage {
    this.challengeCategories().should('contain.text', category)
    return this
  }

  hasStrengthCategory(category: string): DeleteAlnScreenerReviewPage {
    this.strengthCategories().should('contain.text', category)
    return this
  }

  private challengeCategories = (): PageElement => cy.get('[data-qa=screener-challenge-category]')

  private strengthCategories = (): PageElement => cy.get('[data-qa=screener-strength-category]')
}
