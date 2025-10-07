import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import Error404Page from '../../../pages/error404'
import OverviewPage from '../../../pages/profile/overviewPage'
import WhoReviewedThePlanPage from '../../../pages/education-support-plan/whoReviewedThePlanPage'
import PlanReviewedByValue from '../../../../server/enums/planReviewedByValue'
import OtherPeopleConsultedPage from '../../../pages/education-support-plan/otherPeopleConsultedPage'
import OtherPeopleConsultedAddPersonPage from '../../../pages/education-support-plan/otherPeopleConsultedAddPersonPage'
import OtherPeopleConsultedListPage from '../../../pages/education-support-plan/otherPeopleConsultedListPage'
import IndividualViewOnProgressPage from '../../../pages/education-support-plan/individualViewOnProgressPage'

context('Review an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubCreateEducationSupportPlan', prisonNumber)
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber })
    cy.task('stubGetSupportStrategies', { prisonNumber })
    cy.task('stubGetEducationSupportPlan', prisonNumber)
  })

  it('should be able to navigate directly to the review Education Support Plan page', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`)

    // Then
    Page.verifyOnPage(WhoReviewedThePlanPage)
  })

  it('should review a prisoners Education Support Plan, triggering validation on every screen', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`)

    // When
    Page.verifyOnPage(WhoReviewedThePlanPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(WhoReviewedThePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewedBy')
      // submit the page without the name or job role, triggering different validation
      .selectWhoReviewedThePlan(PlanReviewedByValue.SOMEBODY_ELSE)
      .submitPageTo(WhoReviewedThePlanPage)
      .hasErrorCount(1)
      .hasFieldInError('reviewedBy')
      // enter the fields and submit the form to the next page
      .enterFullName('Joe Bloggs')
      .enterJobRole('Peer Mentor')
      .submitPageTo(OtherPeopleConsultedPage)

    Page.verifyOnPage(OtherPeopleConsultedPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(OtherPeopleConsultedPage)
      .hasErrorCount(1)
      .hasFieldInError('wereOtherPeopleConsulted')
      // enter the fields and submit the form to the next page
      .selectOtherPeopleWereConsulted()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)

    Page.verifyOnPage(OtherPeopleConsultedAddPersonPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      .hasErrorCount(2)
      .hasFieldInError('fullName')
      .hasFieldInError('jobRole')
      // enter the fields and submit the form to the next page
      .enterFullName('A Teacher')
      .enterJobRole('Teacher')
      .submitPageTo(OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(1)
      .personAtRowIs(1, 'A Teacher', 'Teacher')
      .clickToAddAnotherPerson()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      .hasErrorCount(2)
      .hasFieldInError('fullName')
      .hasFieldInError('jobRole')
      // enter the fields and submit the form to the next page
      .enterFullName('Another Teacher')
      .enterJobRole('Teacher')
      .submitPageTo(OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(2)
      .personAtRowIs(1, 'A Teacher', 'Teacher')
      .personAtRowIs(2, 'Another Teacher', 'Teacher')
      .submitPageTo(IndividualViewOnProgressPage)

    Page.verifyOnPage(IndividualViewOnProgressPage)
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(IndividualViewOnProgressPage)
      .hasErrorCount(1)
      .hasFieldInError('prisonerViewOnProgress')
      // submit the page with both prisoner view and checkbox indicating they refused to take part, triggering different validation
      .enterPrisonersViewOnProgress('Chris is happy with his progress so far')
      .selectPrisonerDeclinedBeingPartOfReview()
      .submitPageTo(IndividualViewOnProgressPage)
      .hasErrorCount(1)
      .hasFieldInError('prisonerViewOnProgress')
      // clear the checkbox, submitting just the prisoner view on progress
      .deSelectPrisonerDeclinedBeingPartOfReview()

    // TODO - flesh out this test, page by page, as each page in the review journey is implemented
  })

  it('should not be able to review Education Support Plan given prisoner does not have an ELSP', () => {
    // Given
    cy.task('stubGetEducationSupportPlan404Error', prisonNumber)
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should redirect to Profile Overview page with API Error Banner given API returns an error retrieving the ELSP', () => {
    // Given
    cy.task('stubGetEducationSupportPlan500Error', prisonNumber)
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to review ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`)

    // Then
    Page.verifyOnPage(OverviewPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not be able to navigate directly to the review Education Support Plan page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to review ELSPs
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/review/who-reviewed-the-plan`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
