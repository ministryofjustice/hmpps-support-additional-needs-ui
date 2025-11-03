import Page, { PageElement } from '../page'
import ChallengeType from '../../../server/enums/challengeType'

export default class ChallengeCategoryPage extends Page {
  constructor() {
    super('challenge-select-category')
  }

  selectCategory(value: ChallengeType): ChallengeCategoryPage {
    this.radioButton(value).click()
    return this
  }

  private radioButton = (value: ChallengeType): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
