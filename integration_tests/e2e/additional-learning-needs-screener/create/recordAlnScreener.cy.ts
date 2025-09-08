import { format, startOfToday, subDays } from 'date-fns'
import Page from '../../../pages/page'
import ScreenerDatePage from '../../../pages/additional-learning-needs-screener/screenerDatePage'
import OverviewPage from '../../../pages/profile/overviewPage'
import ChallengesPage from '../../../pages/profile/challengesPage'
import AddChallengesPage from '../../../pages/additional-learning-needs-screener/addChallengesPage'
import AddStrengthsPage from '../../../pages/additional-learning-needs-screener/addStrengthsPage'
import CheckYourAnswersPage from '../../../pages/additional-learning-needs-screener/checkYourAnswersPage'
import ChallengeType from '../../../../server/enums/challengeType'
import StrengthType from '../../../../server/enums/strengthType'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context('Record an Additional Learning Needs screener for a prisoner', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubChallengesReferenceData')
    cy.task('stubStrengthsReferenceData')
    cy.task('stubRecordAlnScreener', prisonNumber)
  })

  it('should be able to navigate directly to the first page of the record aln screener journey', () => {
    // Given

    // When
    cy.visit(`/aln-screener/${prisonNumber}/create/screener-date`)

    // Then
    Page.verifyOnPage(ScreenerDatePage)
  })

  it('should record a prisoners ALN Screener, triggering validation on every screen', () => {
    // Given
    const screenerDate = subDays(startOfToday(), 3)

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Challenges', ChallengesPage)
      .clickRecordAlnScreenerButton()

    // When
    Page.verifyOnPage(ScreenerDatePage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ScreenerDatePage)
      .hasErrorCount(1)
      .hasFieldInError('screenerDate')
      // submit the page with an invalid format date
      .setScreenerDate('3rd January 2022')
      .submitPageTo(ScreenerDatePage)
      .hasErrorCount(1)
      .hasFieldInError('screenerDate')
      // enter the fields and submit the form to the next page
      .setScreenerDate(format(screenerDate, 'd/M/yyyy'))
      .submitPageTo(AddChallengesPage)

    Page.verifyOnPage(AddChallengesPage)
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(AddChallengesPage)
      .hasErrorCount(1)
      .hasFieldInError('challengeTypeCodes')
      // enter the fields and submit the form to the next page
      .selectChallenge(ChallengeType.LANGUAGE_DECODING)
      .selectChallenge(ChallengeType.LANGUAGE_FLUENCY)
      .submitPageTo(AddStrengthsPage)

    Page.verifyOnPage(AddStrengthsPage)
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(AddStrengthsPage)
      .hasErrorCount(1)
      .hasFieldInError('strengthTypeCodes')
      // enter the fields and submit the form to the next page
      .selectStrength(StrengthType.LISTENING)
      .selectStrength(StrengthType.READING)
      .submitPageTo(CheckYourAnswersPage)

    Page.verifyOnPage(CheckYourAnswersPage)
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(CheckYourAnswersPage)
      .hasErrorCount(1)
      .hasFieldInError('screenerInformationIsCorrect')
      // enter the fields and submit the form to the next page
      .selectInformationIsCorrectCheckbox()
      .submitPageTo(OverviewPage)

    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/aln-screener`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              "@.prisonId == 'BXI' && " +
              '@.challenges.size() == 2 && ' +
              "@.challenges[0].challengeTypeCode == 'LANGUAGE_DECODING' && " +
              "@.challenges[1].challengeTypeCode == 'LANGUAGE_FLUENCY' && " +
              '@.strengths.size() == 2 && ' +
              "@.strengths[0].strengthTypeCode == 'READING' && " +
              "@.strengths[1].strengthTypeCode == 'LISTENING' && " +
              `@.screenerDate == '${format(screenerDate, 'yyyy-MM-dd')}'` +
              ')]',
          ),
        ),
    )
  })

  it('should not record an Additional Learning Needs screener given API returns an error response', () => {
    // Given
    cy.task('stubRecordAlnScreener500Error', prisonNumber)

    cy.recordAlnScreenerToArriveOnCheckYourAnswers({ prisonNumber })

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(CheckYourAnswersPage) //
      .selectInformationIsCorrectCheckbox()
      .submitPageTo(CheckYourAnswersPage) // Submit the page but expect to stay on the Check Your Answers page due to API error

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsDisplayed()
  })
})
