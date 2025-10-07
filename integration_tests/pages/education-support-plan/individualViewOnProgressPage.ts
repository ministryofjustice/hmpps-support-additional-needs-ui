import Page, { PageElement } from '../page'

export default class IndividualViewOnProgressPage extends Page {
  constructor() {
    super('education-support-plan-individual-view-on-progress')
  }

  enterPrisonersViewOnProgress(value: string): IndividualViewOnProgressPage {
    this.prisonerViewOnProgressField().clear().type(value, { delay: 0 })
    return this
  }

  clearPrisonersViewOnProgress(): IndividualViewOnProgressPage {
    this.prisonerViewOnProgressField().clear()
    return this
  }

  selectPrisonerDeclinedBeingPartOfReview(): IndividualViewOnProgressPage {
    this.prisonerDeclinedBeingPartOfReviewCheckbox().then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectPrisonerDeclinedBeingPartOfReview(): IndividualViewOnProgressPage {
    this.prisonerDeclinedBeingPartOfReviewCheckbox().then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  private prisonerViewOnProgressField = (): PageElement => cy.get('textarea[name=prisonerViewOnProgress]')

  private prisonerDeclinedBeingPartOfReviewCheckbox = (): PageElement =>
    cy.get('.govuk-checkboxes__input[name=prisonerDeclinedBeingPartOfReview]')
}
