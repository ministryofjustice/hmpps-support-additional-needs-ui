import Page, { PageElement } from '../page'
import ScreenerDatePage from './screenerDatePage'
import AddChallengesPage from './addChallengesPage'
import AddStrengthsPage from './addStrengthsPage'

export default class CheckYourAnswersPage extends Page {
  constructor() {
    super('record-aln-check-your-answers')
  }

  clickScreenerDateChangeLink(): ScreenerDatePage {
    this.screenerDateChangeLink().click()
    return Page.verifyOnPage(ScreenerDatePage)
  }

  hasScreenerDate(expected: string): CheckYourAnswersPage {
    this.screenerDateValue().should('contain.text', expected)
    return this
  }

  hasNoChallenges(): CheckYourAnswersPage {
    this.identifiedChallenges().should('contain.text', 'No challenges identified')
    this.identifiedChallenges().find('li').should('not.exist')
    return this
  }

  hasChallenges(...expected: Array<string>): CheckYourAnswersPage {
    this.identifiedChallenges().should('not.contain.text', 'No challenges identified')
    this.identifiedChallenges()
      .find('li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', expected.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', expected[index])
        })
      })
    return this
  }

  clickChallengesChangeLink(): AddChallengesPage {
    this.challengesChangeLink().click()
    return Page.verifyOnPage(AddChallengesPage)
  }

  hasNoStrengths(): CheckYourAnswersPage {
    this.identifiedStrengths().should('contain.text', 'No strengths identified')
    this.identifiedStrengths().find('li').should('not.exist')
    return this
  }

  hasStrengths(...expected: Array<string>): CheckYourAnswersPage {
    this.identifiedStrengths().should('not.contain.text', 'No strengths identified')
    this.identifiedStrengths()
      .find('li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', expected.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', expected[index])
        })
      })
    return this
  }

  clickStrengthsChangeLink(): AddStrengthsPage {
    this.strengthsChangeLink().click()
    return Page.verifyOnPage(AddStrengthsPage)
  }

  selectInformationIsCorrectCheckbox(): CheckYourAnswersPage {
    this.confirmInfoIsCorrectCheckbox().then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectInformationIsCorrectCheckbox(): CheckYourAnswersPage {
    this.confirmInfoIsCorrectCheckbox().then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  private screenerDateValue = (): PageElement => cy.get('[data-qa=screener-date]')

  private screenerDateChangeLink = (): PageElement => cy.get('[data-qa=screener-date-change-link]')

  private identifiedChallenges = (): PageElement => cy.get('[data-qa=challenges-identified]')

  private challengesChangeLink = (): PageElement => cy.get('[data-qa=challenges-change-link]')

  private identifiedStrengths = (): PageElement => cy.get('[data-qa=strengths-identified]')

  private strengthsChangeLink = (): PageElement => cy.get('[data-qa=strengths-change-link]')

  private confirmInfoIsCorrectCheckbox = () => cy.get('#screenerInformationIsCorrect')
}
