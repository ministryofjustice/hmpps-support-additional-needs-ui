import Page, { PageElement } from '../page'
import ChallengeIdentificationSource from '../../../server/enums/challengeIdentificationSource'

export default class AddChallengeDetailPage extends Page {
  constructor() {
    super('create-challenge-detail')
  }

  enterDescription(value: string): AddChallengeDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  enterOtherHowChallengeIdentified(value: string): AddChallengeDetailPage {
    this.otherIdentificationSourceField().clear().type(value, { delay: 0 })
    return this
  }

  selectHowChallengeIdentified(option: ChallengeIdentificationSource): AddChallengeDetailPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectHowChallengeIdentified(option: ChallengeIdentificationSource): AddChallengeDetailPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  private descriptionField = (): PageElement => cy.get('textarea[name=description]')

  private otherIdentificationSourceField = (): PageElement => cy.get('input[name=howIdentifiedOther]')

  private checkbox = (option: ChallengeIdentificationSource): PageElement =>
    cy.get(`.govuk-checkboxes__input[value='${option}']`)
}
