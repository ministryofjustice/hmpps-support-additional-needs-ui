import { v4 as uuidV4 } from 'uuid'
import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overview/overviewPage'

context('Prevent out of sequence navigation to pages in the Create Education Support Plan journey', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
  })
  ;[
    'other-people-consulted',
    'other-people-consulted/add-person',
    'other-people-consulted/list',
    'review-needs-conditions-and-strengths',
    'individual-support-requirements',
    'teaching-adjustments',
    'specific-teaching-skills',
    'exam-arrangements',
    'education-health-care-plan',
    'lnsp-support',
    'additional-information',
    'next-review-date',
    'check-your-answers',
  ].forEach(page => {
    it(`should prevent direct navigation to ${page} page when the user has not started the Create Education Support Plan journey`, () => {
      // Given
      const journeyId = uuidV4()

      // When
      cy.visit(`/education-support-plan/${prisonNumber}/create/${journeyId}/${page}`)

      // Then
      Page.verifyOnPage(OverviewPage)
    })
  })
})
