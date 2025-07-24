import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import SelectChallengeCategoryPage from '../challenges/selectChallengeCategoryPage'
import ScreenerDatePage from '../additional-learning-needs-screener/screenerDatePage'

export default class ChallengesPage extends ProfilePage {
  constructor() {
    super('profile-challenges')
    this.activeTabIs('Challenges')
  }

  clickAddChallengesButton(): SelectChallengeCategoryPage {
    this.addChallengeButton().click()
    return Page.verifyOnPage(SelectChallengeCategoryPage)
  }

  clickRecordAlnScreenerButton(): ScreenerDatePage {
    this.recordAlnScreenerButton().click()
    return Page.verifyOnPage(ScreenerDatePage)
  }

  private challengesActionItems = (): PageElement => cy.get('[data-qa=challenges-action-items] li')

  private addChallengeButton = (): PageElement => this.challengesActionItems().find('[data-qa=add-challenge-button]')

  private recordAlnScreenerButton = (): PageElement =>
    this.challengesActionItems().find('[data-qa=record-screener-results-button]')
}
