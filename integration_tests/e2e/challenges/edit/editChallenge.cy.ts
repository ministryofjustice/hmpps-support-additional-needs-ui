import Page from '../../../pages/page'
import Error404Page from '../../../pages/error404'
import ChallengesPage from '../../../pages/profile/challengesPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'

context('Edit a Challenge', () => {
  const prisonNumber = 'G6115VJ'
  const challengeReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit challenges
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetChallenge', { prisonNumber, challengeReference })
  })

  it('should display profile overview page given retrieving challenge returns an error', () => {
    // Given
    cy.task('stubGetChallenge500Error', { prisonNumber, challengeReference })

    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given challenge does not exist', () => {
    // Given
    cy.task('stubGetChallenge404Error', { prisonNumber, challengeReference })

    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the edit challenge page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to edit challenges
    cy.signIn()

    // When
    cy.visit(`/challenges/${prisonNumber}/${challengeReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
