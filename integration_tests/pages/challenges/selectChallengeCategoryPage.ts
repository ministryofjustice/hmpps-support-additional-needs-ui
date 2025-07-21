import Page, { PageElement } from '../page'
import ChallengeCategory from '../../../server/enums/challengeCategory'

export default class SelectChallengeCategoryPage extends Page {
  constructor() {
    super('create-challenge-select-category')
  }

  selectCategory(value: ChallengeCategory): SelectChallengeCategoryPage {
    this.radioButton(value).click()
    return this
  }

  private radioButton = (value: ChallengeCategory): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
