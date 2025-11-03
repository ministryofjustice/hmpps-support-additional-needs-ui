import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import StrengthDetailPage from '../../../pages/strengths/strengthDetailPage'
import OverviewPage from '../../../pages/profile/overviewPage'
import StrengthsPage from '../../../pages/profile/strengthsPage'
import StrengthIdentificationSource from '../../../../server/enums/strengthIdentificationSource'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import Error404Page from '../../../pages/error404'

context('Edit a Strength', () => {
  const prisonNumber = 'G6115VJ'
  const strengthReference = 'c88a6c48-97e2-4c04-93b5-98619966447b'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to edit strengths
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubGetStrengths', { prisonNumber, strengthReference })
    cy.task('stubGetStrength', { prisonNumber, strengthReference })
    cy.task('stubUpdateStrength', { prisonNumber, strengthReference })
  })

  it('should be able to navigate directly to the edit strength page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/edit/detail`)

    // Then
    Page.verifyOnPage(StrengthDetailPage)
  })

  it('should edit a prisoners Strength, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Strengths', StrengthsPage)
      .clickToEditNthNonAlnStrength(1)

    // When
    Page.verifyOnPage(StrengthDetailPage) //
      .hasNoErrors()
      // Strength already has an answer to Description - clear the answer to trigger a validation error
      .clearDescription()
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(StrengthDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('description')
      // Set a new answer
      .enterDescription('John is great at all forms of mental arithmetic')
      // Select Other but submit without a reason
      .selectHowStrengthIdentified(StrengthIdentificationSource.OTHER)
      .submitPageTo(StrengthDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('howIdentifiedOther')
      .enterOtherHowStrengthIdentified('John has demonstrated his maths strengths in class')
      .submitPageTo(StrengthsPage)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .hasSuccessMessage('Strength updated')

    cy.wiremockVerify(
      putRequestedFor(
        urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/strengths/${strengthReference}`),
      ) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              "@.symptoms == 'John is great at all forms of mental arithmetic' && " +
              '@.howIdentified.size() == 2 && ' +
              "@.howIdentified[0] == 'EDUCATION_SKILLS_WORK' && " +
              "@.howIdentified[1] == 'OTHER' && " +
              "@.howIdentifiedOther == 'John has demonstrated his maths strengths in class' " +
              ')]',
          ),
        ),
    )
  })

  it('should not edit a Strength given API returns an error response', () => {
    // Given
    cy.task('stubUpdateStrength500Error', { prisonNumber, strengthReference })

    cy.signIn()
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/edit/detail`)

    Page.verifyOnPage(StrengthDetailPage) //
      .enterDescription('John is great at all forms of mental arithmetic')
      .selectHowStrengthIdentified(StrengthIdentificationSource.OTHER)
      .enterOtherHowStrengthIdentified('John has demonstrated his maths strengths in class')

    // When
    Page.verifyOnPage(StrengthDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(StrengthDetailPage) //
      .submitPageTo(StrengthDetailPage) // Submit the page but expect to stay on the Strength Detail page due to API error

    // Then
    Page.verifyOnPage(StrengthDetailPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display profile overview page given retrieving strength returns an error', () => {
    // Given
    cy.task('stubGetStrength500Error', { prisonNumber, strengthReference })

    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display 404 page given strength does not exist', () => {
    // Given
    cy.task('stubGetStrength404Error', { prisonNumber, strengthReference })

    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should not be able to navigate directly to the edit strength page given user does not have the required role', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to edit strengths
    cy.signIn()

    // When
    cy.visit(`/strengths/${prisonNumber}/${strengthReference}/edit/detail`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
