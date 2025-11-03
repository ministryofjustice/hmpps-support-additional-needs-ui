import Page, { PageElement } from '../page'
import ChallengeIdentificationSource from '../../../server/enums/challengeIdentificationSource'

export default class ChallengeDetailPage extends Page {
  constructor() {
    super('challenge-detail')
  }

  enterDescription(value: string): ChallengeDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  clearDescription(): ChallengeDetailPage {
    this.descriptionField().clear()
    return this
  }

  enterOtherHowChallengeIdentified(value: string): ChallengeDetailPage {
    this.otherIdentificationSourceField().clear().type(value, { delay: 0 })
    return this
  }

  selectHowChallengeIdentified(option: ChallengeIdentificationSource): ChallengeDetailPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectHowChallengeIdentified(option: ChallengeIdentificationSource): ChallengeDetailPage {
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
