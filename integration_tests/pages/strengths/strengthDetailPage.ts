import Page, { PageElement } from '../page'
import StrengthIdentificationSource from '../../../server/enums/strengthIdentificationSource'

export default class StrengthDetailPage extends Page {
  constructor() {
    super('strength-detail')
  }

  enterDescription(value: string): StrengthDetailPage {
    this.descriptionField().clear().type(value, { delay: 0 })
    return this
  }

  clearDescription(): StrengthDetailPage {
    this.descriptionField().clear()
    return this
  }

  enterOtherHowStrengthIdentified(value: string): StrengthDetailPage {
    this.otherIdentificationSourceField().clear().type(value, { delay: 0 })
    return this
  }

  selectHowStrengthIdentified(option: StrengthIdentificationSource): StrengthDetailPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectHowStrengthIdentified(option: StrengthIdentificationSource): StrengthDetailPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  howStrengthIdentifiedIsSelected(option: StrengthIdentificationSource): StrengthDetailPage {
    this.checkbox(option).should('be.checked')
    return this
  }

  hasHowStrengthIdentifiedOptionCount(count: number): StrengthDetailPage {
    cy.get(`.govuk-checkboxes__input[name='howIdentified']`).should('have.length', count)
    return this
  }

  mappingWarningIsDisplayed(): StrengthDetailPage {
    this.mappingWarning().should('exist')
    return this
  }

  mappingWarningIsNotDisplayed(): StrengthDetailPage {
    this.mappingWarning().should('not.exist')
    return this
  }

  private descriptionField = (): PageElement => cy.get('textarea[name=description]')

  private otherIdentificationSourceField = (): PageElement => cy.get('input[name=howIdentifiedOther]')

  private checkbox = (option: StrengthIdentificationSource): PageElement =>
    cy.get(`.govuk-checkboxes__input[value='${option}']`)

  private mappingWarning = (): PageElement => cy.get(`[data-qa='how-identified-mapping-warning']`)
}
