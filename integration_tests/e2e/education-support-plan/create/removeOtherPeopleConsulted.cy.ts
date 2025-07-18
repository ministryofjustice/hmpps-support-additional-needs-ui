import WhoCreatedThePlanPage from '../../../pages/education-support-plan/whoCreatedThePlanPage'
import Page from '../../../pages/page'
import PlanCreatedByValue from '../../../../server/enums/planCreatedByValue'
import OtherPeopleConsultedPage from '../../../pages/education-support-plan/otherPeopleConsultedPage'
import OtherPeopleConsultedAddPersonPage from '../../../pages/education-support-plan/otherPeopleConsultedAddPersonPage'
import OtherPeopleConsultedListPage from '../../../pages/education-support-plan/otherPeopleConsultedListPage'

context('Add and remove Other People Consulted during creation of Education Support Plan journey', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
  })

  it('should be able to add and remove other people consulted', () => {
    // Given
    cy.visit(`/education-support-plan/${prisonNumber}/create/who-created-the-plan`)

    Page.verifyOnPage(WhoCreatedThePlanPage)
      .selectWhoCreatedThePlan(PlanCreatedByValue.MYSELF)
      .submitPageTo(OtherPeopleConsultedPage)
      .selectOtherPeopleWereConsulted()
      .submitPageTo(OtherPeopleConsultedAddPersonPage)
      // Add person 1
      .enterFullName('Person 1')
      .submitPageTo(OtherPeopleConsultedListPage)
      // Add person 2
      .clickToAddAnotherPerson()
      .enterFullName('Person 2')
      .submitPageTo(OtherPeopleConsultedListPage)
      // Add person 3
      .clickToAddAnotherPerson()
      .enterFullName('Person 3')
      .submitPageTo(OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(3)
      .personAtRowIs(1, 'Person 1')
      .personAtRowIs(2, 'Person 2')
      .personAtRowIs(3, 'Person 3')

    // When
    Page.verifyOnPage(OtherPeopleConsultedListPage)
      // remove person 2
      .removePerson(2, OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(2)
      .personAtRowIs(1, 'Person 1')
      .personAtRowIs(2, 'Person 3')
      // remove person 1
      .removePerson(1, OtherPeopleConsultedListPage)
      .numberOfPeopleConsultedIs(1)
      .personAtRowIs(1, 'Person 3')
      // remove person 3 (who is now at row 1); expect to be on the OtherPeopleConsulted page because we have removed everyone
      .removePerson(1, OtherPeopleConsultedPage)

    // Then
    Page.verifyOnPage(OtherPeopleConsultedPage)
  })
})
