import Page from '../../../pages/page'
import EducationHealthCarePlanPage from '../../../pages/education-support-plan/educationHealthCarePlanPage'
import Error404Page from '../../../pages/error404'
import OverviewPage from '../../../pages/profile/overviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import EducationSupportPlanPage from '../../../pages/profile/educationSupportPlanPage'

context('Update the EHCP question of an Education Support Plan', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetStrengths', { prisonNumber })
    cy.task('stubGetChallenges', { prisonNumber })
    cy.task('stubGetConditions', { prisonNumber })
    cy.task('stubGetSupportStrategies', { prisonNumber })
    cy.task('stubGetEducationSupportPlan', prisonNumber)
    cy.task('stubUpdateEchpStatus', prisonNumber)
  })

  it('should be able to navigate directly to the update EHCP page', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit ELSPs)
    cy.signIn()

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/update/education-health-care-plan`)

    // Then
    Page.verifyOnPage(EducationHealthCarePlanPage)
  })

  it('should update a prisoners EHCP status in their Education Support Plan', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to update ELSPs)
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Education support plan', EducationSupportPlanPage)
      .doesNotHaveCurrentEhcp()
      .clickToUpdateEhcp() // The EHCP property for the ELSP that is loaded via the stub is false

    // When
    Page.verifyOnPage(EducationHealthCarePlanPage) //
      .selectHasCurrentEhcp()
      .submitPageTo(EducationSupportPlanPage)

    // Then
    Page.verifyOnPage(EducationSupportPlanPage) //
      .hasSuccessMessage('Education support plan updated')
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/ehcp-status`)).withRequestBody(
        matchingJsonPath(`$[?(@.prisonId == 'BXI' && @.hasCurrentEhcp == true)]`),
      ),
    )
  })

  it('should not update a prisoners EHCP status in their Education Support Plan given API returns an error response', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to update ELSPs)
    cy.signIn()
    cy.task('stubUpdateEchpStatus500Error', prisonNumber)

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Education support plan', EducationSupportPlanPage)
      .doesNotHaveCurrentEhcp()
      .clickToUpdateEhcp() // The EHCP property for the ELSP that is loaded via the stub is false

    // When
    Page.verifyOnPage(EducationHealthCarePlanPage) //
      .selectHasCurrentEhcp()
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(EducationHealthCarePlanPage) //
      .submitPageTo(EducationHealthCarePlanPage) // Submit the page but expect to stay on the EHCP page due to API error

    // Then
    Page.verifyOnPage(EducationHealthCarePlanPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not navigate directly to the update EHCP page given the prisoner does not have an ELSP', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit ELSPs)
    cy.signIn()
    cy.task('stubGetEducationSupportPlan404Error', prisonNumber)

    // When
    cy.visit(`/education-support-plan/${prisonNumber}/update/education-health-care-plan`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
