import { v4 as uuidV4 } from 'uuid'
import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overviewPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'

context('Prevent out of sequence navigation to pages in the Review Education Support Plan journey', () => {
  const prisonNumber = 'A00001A'

  const pages = [
    'other-people-consulted',
    'other-people-consulted/add-person',
    'other-people-consulted/list',
    'individual-view-on-progress',
    'reviewers-view-on-progress',
    'review-existing-needs',
    'review-existing-needs',
    'review-existing-needs/strengths',
    'review-existing-needs/conditions',
    'review-existing-needs/challenges',
    'review-existing-needs/support-strategies',
    'teaching-adjustments',
    'specific-teaching-skills',
    'exam-arrangements',
    'lnsp-support',
    'additional-information',
    'next-review-date',
    'check-your-answers',
  ]

  beforeEach(() => {
    cy.task('reset')
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
  })

  pages.forEach(page => {
    it(`should prevent direct navigation to ${page} page when the user has not started the Review Education Support Plan journey`, () => {
      // Given
      cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs
      cy.signIn()

      const journeyId = uuidV4()

      // When
      cy.visit(`/education-support-plan/${prisonNumber}/review/${journeyId}/${page}`)

      // Then
      Page.verifyOnPage(OverviewPage)
    })
  })

  pages.forEach(page => {
    it(`should prevent direct navigation to ${page} page when the user does not have the necessary role to review an ELSP`, () => {
      // Given
      cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to review ELSPs
      cy.signIn()

      const journeyId = uuidV4()

      // When
      cy.visit(`/education-support-plan/${prisonNumber}/review/${journeyId}/${page}`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })
})
