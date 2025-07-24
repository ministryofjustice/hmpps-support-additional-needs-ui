import Page, { PageElement } from '../page'
import ChallengeType from '../../../server/enums/challengeType'

export default class AddChallengesPage extends Page {
  constructor() {
    super('record-aln-add-challenges')
  }

  selectChallenge(option: ChallengeType): AddChallengesPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectChallenge(option: ChallengeType): AddChallengesPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  private checkbox = (option: ChallengeType): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)
}
