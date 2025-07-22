import Page, { PageElement } from '../page'
import ChallengeType from '../../../server/enums/challengeType'

export default class SelectChallengeCategoryPage extends Page {
  constructor() {
    super('create-challenge-select-category')
  }

  selectCategory(value: ChallengeType): SelectChallengeCategoryPage {
    this.radioButton(value).click()
    return this
  }

  private radioButton = (value: ChallengeType): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
