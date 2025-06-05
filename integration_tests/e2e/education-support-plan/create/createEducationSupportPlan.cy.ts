import WhoCreatedThePlanPage from '../../../pages/education-support-plan/whoCreatedThePlanPage'
import Page from '../../../pages/page'
import PlanCreatedByValue from '../../../../server/enums/planCreatedByValue'
import OtherPeopleConsultedPage from '../../../pages/education-support-plan/otherPeopleConsultedPage'
import ReviewNeedsConditionsStrengthsPage from '../../../pages/education-support-plan/reviewNeedsConditionsStrengthsPage'
import OverviewPage from '../../../pages/profile/overview/overviewPage'
import LearningEnvironmentAdjustmentsPage from '../../../pages/education-support-plan/learningEnvironmentAdjustmentsPage'

context('Create an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should be able to navigate directly to the create Education Support Plan page', () => {
    // Given

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/create/who-created-the-plan`)

    // Then
    Page.verifyOnPage(WhoCreatedThePlanPage)
  })

  it('should create a prisoners Education Support Plan, triggering validation on every screen', () => {
    // Given
    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .actionsCardContainsEducationSupportPlanActions()
      .clickCreateEducationSupportPlanButton()

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
      .submitPageTo(OtherPeopleConsultedPage)

    Page.verifyOnPage(OtherPeopleConsultedPage) //
      .submitPageTo(ReviewNeedsConditionsStrengthsPage)

    Page.verifyOnPage(ReviewNeedsConditionsStrengthsPage) //
      .submitPageTo(LearningEnvironmentAdjustmentsPage)

    Page.verifyOnPage(LearningEnvironmentAdjustmentsPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(LearningEnvironmentAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('adjustmentsNeeded')
      // submit the page without the details, triggering different validation
      .selectLearningAdjustmentsRequired()
      .submitPageTo(LearningEnvironmentAdjustmentsPage)
      .hasErrorCount(1)
      .hasFieldInError('details')
      // enter the fields and submit the form to the next page
      .enterDetails('Needs to sit at the front of the class')

    // Then
  })
})
