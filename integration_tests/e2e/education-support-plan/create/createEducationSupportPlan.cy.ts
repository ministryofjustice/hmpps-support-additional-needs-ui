import WhoCreatedThePlanPage from '../../../pages/education-support-plan/whoCreatedThePlanPage'
import Page from '../../../pages/page'
import PlanCreatedByValue from '../../../../server/enums/planCreatedByValue'

context('Create an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should create a prisoners Education Support Plan, triggering validation on every screen', () => {
    // Given
    cy.visit(`/education-support-plan/${prisonNumber}/create/who-created-the-plan`)

    // When
    Page.verifyOnPage(WhoCreatedThePlanPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(WhoCreatedThePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('completedBy')
      // submit the page without the name or job role, triggering different validation
      .selectWhoCreatedThePlan(PlanCreatedByValue.SOMEBODY_ELSE)
      .submitPageTo(WhoCreatedThePlanPage)
      .hasErrorCount(2)
      .hasFieldInError('completedByOtherFullName')
      .hasFieldInError('completedByOtherJobRole')
      // enter the fields and submit the form to the next page
      .enterFullName('Joe Bloggs')
      .enterJobRole('Peer Mentor')
    // TODO submit to next page

    // Then
  })
})
