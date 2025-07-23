import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overviewPage'
import SelectStrengthCategoryPage from '../../../pages/strengths/selectStrengthCategoryPage'
import StrengthsPage from '../../../pages/profile/strengthsPage'
import AddStrengthDetailPage from '../../../pages/strengths/addStrengthDetailPage'
import StrengthIdentificationSource from '../../../../server/enums/strengthIdentificationSource'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import StrengthType from '../../../../server/enums/strengthType'

context('Create a Strength', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
    cy.task('stubCreateStrengths', prisonNumber)
  })

  it('should be able to navigate directly to the create Strength page', () => {
    // Given

    // When
    cy.visit(`/strengths/${prisonNumber}/create/select-category`)

    // Then
    Page.verifyOnPage(SelectStrengthCategoryPage)
  })

  it('should create a prisoners Strength, triggering validation on every screen', () => {
    // Given
    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Strengths', StrengthsPage)
      .clickAddStrengthButton()

    // When
    Page.verifyOnPage(SelectStrengthCategoryPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(SelectStrengthCategoryPage)
      .hasErrorCount(1)
      .hasFieldInError('category')
      // select a category and submit the form to the next page
      .selectCategory(StrengthType.EMOTIONS_FEELINGS_DEFAULT)
      .submitPageTo(AddStrengthDetailPage)

    Page.verifyOnPage(AddStrengthDetailPage)
      .hasPageHeading('Add emotions and feelings strength')
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(AddStrengthDetailPage)
      .hasErrorCount(2)
      .hasFieldInError('description')
      .hasFieldInError('howIdentified')
      // enter a description only and submit
      .enterDescription('Chris shows strong empathy when dealing with others')
      .submitPageTo(AddStrengthDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('howIdentified')
      // select how the strength was identified, including Other, but do not enter a reason
      .selectHowStrengthIdentified(StrengthIdentificationSource.FORMAL_PROCESSES)
      .selectHowStrengthIdentified(StrengthIdentificationSource.OTHER)
      .submitPageTo(AddStrengthDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('howIdentifiedOther')
      // enter the detail for Other and submit
      .enterOtherHowStrengthIdentified('Chris has been observed by may people to be very empathetic')
      .submitPageTo(StrengthsPage)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .hasSuccessMessage('Strength added')

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/strengths`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              '@.strengths.size() == 1 && ' +
              "@.strengths[0].prisonId == 'BXI' && " +
              "@.strengths[0].strengthTypeCode == 'EMOTIONS_FEELINGS_DEFAULT' && " +
              "@.strengths[0].symptoms == 'Chris shows strong empathy when dealing with others' && " +
              '@.strengths[0].howIdentified.size() == 2 && ' +
              "@.strengths[0].howIdentified[0] == 'FORMAL_PROCESSES' && " +
              "@.strengths[0].howIdentified[1] == 'OTHER' && " +
              "@.strengths[0].howIdentifiedOther == 'Chris has been observed by may people to be very empathetic' " +
              ')]',
          ),
        ),
    )
  })

  it('should not create a prisoners Strength given API returns an error response', () => {
    // Given
    cy.task('stubCreateStrengths500Error', prisonNumber)

    cy.visit(`/strengths/${prisonNumber}/create/select-category`)

    Page.verifyOnPage(SelectStrengthCategoryPage)
      .selectCategory(StrengthType.EMOTIONS_FEELINGS_DEFAULT)
      .submitPageTo(AddStrengthDetailPage)
      .enterDescription('Chris shows strong empathy when dealing with others')
      .selectHowStrengthIdentified(StrengthIdentificationSource.FORMAL_PROCESSES)

    // When
    Page.verifyOnPage(AddStrengthDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(AddStrengthDetailPage) //
      .submitPageTo(AddStrengthDetailPage) // Submit the page but expect to stay on the Add Strengths Detail page due to API error

    // Then
    Page.verifyOnPage(AddStrengthDetailPage) //
      .apiErrorBannerIsDisplayed()
  })
})
