import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'

context('Edit a SupportStrategy', () => {
  const prisonNumber = 'G6115VJ'
  const supportStrategyReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit support strategies
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetSupportStrategy', { prisonNumber, supportStrategyReference })
  })

  it('should not be able to navigate directly to the edit support strategy page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to edit support strategies
    cy.signIn()

    // When
    cy.visit(`/support-strategies/${prisonNumber}/${supportStrategyReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
