import { v4 as uuidV4 } from 'uuid'
import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overviewPage'

context('Prevent out of sequence navigation to pages in the Create Conditions journey', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
  })
  ;['details'].forEach(page => {
    it(`should prevent direct navigation to ${page} page when the user has not started the Create Conditions journey`, () => {
      // Given
      const journeyId = uuidV4()

      // When
      cy.visit(`/conditions/${prisonNumber}/create/${journeyId}/${page}`)

      // Then
      Page.verifyOnPage(OverviewPage)
    })
  })
})
