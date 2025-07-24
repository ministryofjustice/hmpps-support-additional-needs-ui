/**
 * Cypress tests that test the Change links on the Check Your Answers page when creating an Education Support Plan
 */
import { format, startOfToday, subDays } from 'date-fns'
import Page from '../../../pages/page'
import CheckYourAnswersPage from '../../../pages/additional-learning-needs-screener/checkYourAnswersPage'
import ChallengeType from '../../../../server/enums/challengeType'
import StrengthType from '../../../../server/enums/strengthType'
import OverviewPage from '../../../pages/profile/overviewPage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context(`Change links on the Check Your Answers page when creating an Education Support Plan`, () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubChallengesReferenceData')
    cy.task('stubStrengthsReferenceData')
    cy.task('stubRecordAlnScreener', prisonNumber)
  })

  it('should support all Change links on the Check Your Answers page when recording an Additional Learning Needs screener', () => {
    // Given
    const screenerDate = startOfToday()
    const updatedScreenerDate = subDays(screenerDate, 5)

    cy.recordAlnScreenerToArriveOnCheckYourAnswers({ prisonNumber, screenerDate })

    // When
    Page.verifyOnPage(CheckYourAnswersPage)
      // check and update Review Date
      .hasScreenerDate(format(screenerDate, 'd MMMM yyyy'))
      .clickScreenerDateChangeLink()
      .setScreenerDate(format(updatedScreenerDate, 'd/M/yyyy'))
      .submitPageTo(CheckYourAnswersPage)
      .hasScreenerDate(format(updatedScreenerDate, 'd MMMM yyyy'))

      // check and update challenges
      .hasNoChallenges()
      .clickChallengesChangeLink()
      .selectChallenge(ChallengeType.ARITHMETIC)
      .selectChallenge(ChallengeType.NUMBER_RECALL)
      .selectChallenge(ChallengeType.BALANCE)
      .submitPageTo(CheckYourAnswersPage)
      .hasChallenges('Arithmetic', 'Number recall', 'Balance')

      // check and update strengths
      .hasNoStrengths()
      .clickStrengthsChangeLink()
      .selectStrength(StrengthType.READING)
      .selectStrength(StrengthType.WRITING)
      .selectStrength(StrengthType.ACTIVE_LISTENING)
      .submitPageTo(CheckYourAnswersPage)
      .hasStrengths('Reading', 'Writing', 'Active listening')

      // submit Check Your Answers page
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
              '@.challenges.size() == 3 && ' +
              "@.challenges[0].challengeTypeCode == 'ARITHMETIC' && " +
              "@.challenges[1].challengeTypeCode == 'NUMBER_RECALL' && " +
              "@.challenges[2].challengeTypeCode == 'BALANCE' && " +
              '@.strengths.size() == 3 && ' +
              "@.strengths[0].strengthTypeCode == 'READING' && " +
              "@.strengths[1].strengthTypeCode == 'WRITING' && " +
              "@.strengths[2].strengthTypeCode == 'ACTIVE_LISTENING' && " +
              `@.screenerDate == '${format(updatedScreenerDate, 'yyyy-MM-dd')}'` +
              ')]',
          ),
        ),
    )
  })
})
