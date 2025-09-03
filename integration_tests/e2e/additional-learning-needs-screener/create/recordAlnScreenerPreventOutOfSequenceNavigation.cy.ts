import { v4 as uuidV4 } from 'uuid'
import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overviewPage'

context('Prevent out of sequence navigation to pages in the Record ALN Screener journey', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
  })
  ;['add-challenges', 'add-strengths', 'check-your-answers'].forEach(page => {
    it(`should prevent direct navigation to ${page} page when the user has not started the Record ALN Screener journey`, () => {
      // Given
      const journeyId = uuidV4()

      // When
      cy.visit(`/aln-screener/${prisonNumber}/create/${journeyId}/${page}`)

      // Then
      Page.verifyOnPage(OverviewPage)
    })
  })
})
