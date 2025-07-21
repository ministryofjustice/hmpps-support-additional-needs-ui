import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import SelectChallengeCategoryPage from '../challenges/selectChallengeCategoryPage'

export default class ChallengesPage extends ProfilePage {
  constructor() {
    super('profile-challenges')
    this.activeTabIs('Challenges')
  }

  clickAddChallengesButton(): SelectChallengeCategoryPage {
    this.addChallengeButton().click()
    return Page.verifyOnPage(SelectChallengeCategoryPage)
  }

  private challengesActionItems = (): PageElement => cy.get('[data-qa=challenges-action-items] li')

  private addChallengeButton = (): PageElement => this.challengesActionItems().find('[data-qa=add-challenges-button]')

}
