export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(
    readonly pageId: string,
    readonly options: { axeTest?: boolean } = {
      axeTest: true,
    },
  ) {
    this.checkOnPage()
    this.checkCsfrTokenForFormBasedPages()
    if (options.axeTest) {
      this.runAxe()
    }
  }

  checkOnPage(): void {
    cy.get('#pageId').should('have.attr', 'data-qa').should('equal', this.pageId)
  }

  checkCsfrTokenForFormBasedPages = (): void => {
    cy.get('body').then(body => {
      body.find('form[method=post]').each((idx, form) => {
        cy.wrap(form).find('input[name=_csrf]').should('not.have.value', '')
      })
    })
  }

  runAxe = (): void => {
    cy.injectAxe()
    cy.checkA11y(
      null,
      {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'aria-allowed-attr': { enabled: false },
        },
      },
      violations => {
        cy.task(
          'log',
          `${violations.length} accessibility violation${
            violations.length === 1 ? '' : 's'
          } ${violations.length === 1 ? 'was' : 'were'} detected`,
        )
        const violationData = violations.map(({ id, impact, description, nodes }) => ({
          id,
          impact,
          description,
          nodes: nodes.length,
        }))
        cy.task('table', violationData)
      },
    )
  }

  submitPageTo = <T extends Page>(expected: new () => T): T => {
    this.submitButton().then($btn => {
      if ($btn.length > 0) {
        this.submitButton().click()
      } else {
        cy.log('No submit button found on this page.')
      }
    })
    return Page.verifyOnPage(expected)
  }

  clickBackLinkTo = <T extends Page>(expected: new () => T): T => {
    this.backLink().click()
    return Page.verifyOnPage(expected)
  }

  apiErrorBannerIsNotDisplayed = () => {
    this.apiErrorBanner().should('not.exist')
  }

  apiErrorBannerIsDisplayed = () => {
    this.apiErrorBanner().should('be.visible')
  }

  hasNoErrors() {
    cy.get('.govuk-error-summary__list').should('not.exist')
    return this
  }

  hasErrorCount(expected: number) {
    cy.get('.govuk-error-summary__list li').should('have.length', expected)
    return this
  }

  hasFieldInError(field: string) {
    cy.get(`#${Cypress.$.escapeSelector(field)}-error`).should('exist')
    return this
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  private submitButton = (): PageElement => cy.get('[data-qa=submit-button], #submit-button')

  private backLink = (): PageElement => cy.get('.govuk-back-link')

  private apiErrorBanner = (): PageElement => cy.get('[data-qa=api-error-banner]')
}
