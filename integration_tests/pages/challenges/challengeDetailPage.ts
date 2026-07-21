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

  howChallengeIdentifiedIsSelected(option: ChallengeIdentificationSource): ChallengeDetailPage {
    this.checkbox(option).should('be.checked')
    return this
  }

  hasHowChallengeIdentifiedOptionCount(count: number): ChallengeDetailPage {
    cy.get(`.govuk-checkboxes__input[name='howIdentified']`).should('have.length', count)
    return this
  }

  mappingWarningIsDisplayed(): ChallengeDetailPage {
    this.mappingWarning().should('exist')
    return this
  }

  mappingWarningIsNotDisplayed(): ChallengeDetailPage {
    this.mappingWarning().should('not.exist')
    return this
  }

  private descriptionField = (): PageElement => cy.get('textarea[name=description]')

  private otherIdentificationSourceField = (): PageElement => cy.get('input[name=howIdentifiedOther]')

  private checkbox = (option: ChallengeIdentificationSource): PageElement =>
    cy.get(`.govuk-checkboxes__input[value='${option}']`)

  private mappingWarning = (): PageElement => cy.get(`[data-qa='how-identified-mapping-warning']`)
}
