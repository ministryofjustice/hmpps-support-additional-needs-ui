import SearchPage from '../pages/search/searchPage'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in header', () => {
    cy.signIn()
    const landingPage = Page.verifyOnPage(SearchPage)
    landingPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('User can sign out', () => {
    cy.signIn()
    const landingPage = Page.verifyOnPage(SearchPage)
    landingPage.signOut().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(SearchPage)
    cy.task('stubVerifyToken', false)

    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    const landingPage = Page.verifyOnPage(SearchPage)
    cy.task('stubVerifyToken', false)

    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)

    cy.task('stubVerifyToken', true)
    cy.task('stubSignIn', { name: 'bobby brown' })

    cy.signIn()

    landingPage.headerUserName().contains('B. Brown')
  })
})
