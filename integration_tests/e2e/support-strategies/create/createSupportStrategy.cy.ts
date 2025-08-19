import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overviewPage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import SelectSupportStrategyCategoryPage from '../../../pages/support-strategies/selectSupportStrategyCategoryPage'
import SupportStrategyType from '../../../../server/enums/supportStrategyType'
import SupportStrategiesPage from '../../../pages/profile/supportStrategiesPage'
import AddSupportStrategyDetailPage from '../../../pages/support-strategies/addSupportStrategyDetailPage'

context('Create a Support Strategy', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
    cy.task('stubCreateSupportStrategies', prisonNumber)
    cy.task('stubGetSupportStrategies', { prisonNumber })
  })

  it('should be able to navigate directly to the create Support Strategy page', () => {
    // Given

    // When
    cy.visit(`/support-strategies/${prisonNumber}/create/select-category`)

    // Then
    Page.verifyOnPage(SelectSupportStrategyCategoryPage)
  })

  it('should create a prisoners Support Strategy, triggering validation on every screen', () => {
    // Given
    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Support strategies', SupportStrategiesPage)
      .clickAddSupportStrategyButton()

    // When
    Page.verifyOnPage(SelectSupportStrategyCategoryPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(SelectSupportStrategyCategoryPage)
      .hasErrorCount(1)
      .hasFieldInError('category')
      // select a category and submit the form to the next page
      .selectCategory(SupportStrategyType.EMOTIONS_FEELINGS_DEFAULT)
      .submitPageTo(AddSupportStrategyDetailPage)

    Page.verifyOnPage(AddSupportStrategyDetailPage)
      .hasPageHeading('Description of emotions and feelings support strategy')
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(AddSupportStrategyDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('description')
      // enter a description and submit
      .enterDescription(
        `Chris needs help understanding other people's views and feelings. He needs to be able to show empathy when dealing with others.`,
      )
      .submitPageTo(SupportStrategiesPage)

    // Then
    Page.verifyOnPage(SupportStrategiesPage)

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/support-strategies`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              '@.supportStrategies.size() == 1 && ' +
              "@.supportStrategies[0].prisonId == 'BXI' && " +
              "@.supportStrategies[0].supportStrategyTypeCode == 'EMOTIONS_FEELINGS_DEFAULT' && " +
              `@.supportStrategies[0].detail == "Chris needs help understanding other people's views and feelings. He needs to be able to show empathy when dealing with others." ` +
              ')]',
          ),
        ),
    )
  })

  it('should not create a prisoners Support Strategy given API returns an error response', () => {
    // Given
    cy.task('stubCreateSupportStrategies500Error', prisonNumber)

    cy.visit(`/support-strategies/${prisonNumber}/create/select-category`)

    Page.verifyOnPage(SelectSupportStrategyCategoryPage)
      .selectCategory(SupportStrategyType.EMOTIONS_FEELINGS_DEFAULT)
      .submitPageTo(AddSupportStrategyDetailPage)
      .enterDescription(
        `Chris needs help understanding other people's views and feelings. He needs to be able to show empathy when dealing with others.`,
      )

    // When
    Page.verifyOnPage(AddSupportStrategyDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(AddSupportStrategyDetailPage) //
      .submitPageTo(AddSupportStrategyDetailPage) // Submit the page but expect to stay on the Add Support Strategy Detail page due to API error

    // Then
    Page.verifyOnPage(AddSupportStrategyDetailPage) //
      .apiErrorBannerIsDisplayed()
  })
})
