import Page, { PageElement } from '../page'
import ChallengeCategoryPage from '../challenges/challengeCategoryPage'
import ScreenerDatePage from '../additional-learning-needs-screener/screenerDatePage'
import SelectConditionsPage from '../conditions/selectConditionsPage'
import SelectStrengthCategoryPage from '../strengths/selectStrengthCategoryPage'
import ReasonPage from '../education-support-plan/refuse-plan/reasonPage'
import SelectSupportStrategyCategoryPage from '../support-strategies/selectSupportStrategyCategoryPage'
import ReviewExistingNeedsPage from '../education-support-plan/reviewExistingNeedsPage'

export default abstract class ProfilePage extends Page {
  hasSuccessMessage<T extends ProfilePage>(message: string): T {
    this.successMessage() //
      .should('be.visible')
      .and('contain.text', message)
    return this as unknown as T
  }

  doesNotHaveSuccessMessage<T extends ProfilePage>(): T {
    this.successMessage().should('not.exist')
    return this as unknown as T
  }

  selectTab<T extends ProfilePage>(targetTab: string, constructor: new () => T): T {
    this.tabBarLink(targetTab).click()
    return Page.verifyOnPage(constructor)
  }

  activeTabIs<T extends ProfilePage>(expected: string): T {
    this.activeTab().should('contain.text', expected)
    return this as unknown as T
  }

  clickAddChallengesButton(): ChallengeCategoryPage {
    this.addChallengeButton().click()
    return Page.verifyOnPage(ChallengeCategoryPage)
  }

  clickRecordAlnScreenerButton(): ScreenerDatePage {
    this.recordAlnScreenerButton().click()
    return Page.verifyOnPage(ScreenerDatePage)
  }

  clickAddConditionsButton(): SelectConditionsPage {
    this.addConditionsButton().click()
    return Page.verifyOnPage(SelectConditionsPage)
  }

  clickAddStrengthButton(): SelectStrengthCategoryPage {
    this.addStrengthButton().click()
    return Page.verifyOnPage(SelectStrengthCategoryPage)
  }

  clickAddSupportStrategyButton(): SelectSupportStrategyCategoryPage {
    this.addSupportStrategyButton().click()
    return Page.verifyOnPage(SelectSupportStrategyCategoryPage)
  }

  clickCreateEducationSupportPlanButton(): ReviewExistingNeedsPage {
    this.createEducationSupportPlanButton().click()
    return Page.verifyOnPage(ReviewExistingNeedsPage)
  }

  clickDeclineEducationSupportPlanButton(): ReasonPage {
    this.declineEducationSupportPlanButton().click()
    return Page.verifyOnPage(ReasonPage)
  }

  clickReviewEducationSupportPlanButton(): ReviewExistingNeedsPage {
    this.reviewEducationSupportPlanButton().click()
    return Page.verifyOnPage(ReviewExistingNeedsPage)
  }

  actionsCardContainsEducationSupportPlanActions() {
    this.actionsCard().should('exist')
    this.educationSupportPlanActionItems().should('exist')
    return this
  }

  private tabBarLink = (targetTab: string): PageElement => cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`)

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private prisonerSummaryBanner = (): PageElement => cy.get('.prisoner-summary-banner')

  private successMessage = (): PageElement => cy.get('[data-qa=success-message]')

  private addChallengeButton = (): PageElement => cy.get('[data-qa=add-challenge-button]')

  private recordAlnScreenerButton = (): PageElement => cy.get('[data-qa=record-screener-results-button]')

  private addConditionsButton = (): PageElement => cy.get('[data-qa=add-conditions-button]')

  private addStrengthButton = (): PageElement => cy.get('[data-qa=add-strength-button]')

  private addSupportStrategyButton = (): PageElement => cy.get('[data-qa=add-support-strategy-button]')

  private createEducationSupportPlanButton = (): PageElement => cy.get('[data-qa=create-education-support-plan-button]')

  private declineEducationSupportPlanButton = (): PageElement =>
    cy.get('[data-qa=decline-education-support-plan-button]')

  private reviewEducationSupportPlanButton = (): PageElement => cy.get('[data-qa=review-education-support-plan-button]')

  private actionsCard = (): PageElement => cy.get('[data-qa=actions-card]')

  private educationSupportPlanActionItems = (): PageElement =>
    cy.get('[data-qa=education-support-plan-action-items] li')
}
