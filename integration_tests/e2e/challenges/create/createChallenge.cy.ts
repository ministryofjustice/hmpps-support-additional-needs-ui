import Page from '../../../pages/page'
import OverviewPage from '../../../pages/profile/overviewPage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import ChallengeCategoryPage from '../../../pages/challenges/challengeCategoryPage'
import ChallengesPage from '../../../pages/profile/challengesPage'
import ChallengeDetailPage from '../../../pages/challenges/challengeDetailPage'
import ChallengeIdentificationSource from '../../../../server/enums/challengeIdentificationSource'
import ChallengeType from '../../../../server/enums/challengeType'

context('Create a Challenge', () => {
  const prisonNumber = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber })
    cy.task('stubCreateChallenges', prisonNumber)
  })

  it('should be able to navigate directly to the create challenge page', () => {
    // Given

    // When
    cy.visit(`/challenges/${prisonNumber}/create/select-category`)

    // Then
    Page.verifyOnPage(ChallengeCategoryPage)
  })

  it('should create a prisoners Challenge, triggering validation on every screen', () => {
    // Given
    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Challenges', ChallengesPage)
      .clickAddChallengesButton()

    // When
    Page.verifyOnPage(ChallengeCategoryPage) //
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ChallengeCategoryPage)
      .hasErrorCount(1)
      .hasFieldInError('category')
      // select a category and submit the form to the next page
      .selectCategory(ChallengeType.EMOTIONS_FEELINGS_DEFAULT)
      .submitPageTo(ChallengeDetailPage)

    Page.verifyOnPage(ChallengeDetailPage)
      .hasPageHeading('Add emotions and feelings challenge')
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(ChallengeDetailPage)
      .hasErrorCount(2)
      .hasFieldInError('description')
      .hasFieldInError('howIdentified')
      // enter a description only and submit
      .enterDescription('Chris struggles showing empathy when dealing with others')
      .submitPageTo(ChallengeDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('howIdentified')
      // select how the challenge was identified, including Other, but do not enter a reason
      .selectHowChallengeIdentified(ChallengeIdentificationSource.FORMAL_PROCESSES)
      .selectHowChallengeIdentified(ChallengeIdentificationSource.OTHER)
      .submitPageTo(ChallengeDetailPage)
      .hasErrorCount(1)
      .hasFieldInError('howIdentifiedOther')
      // enter the detail for Other and submit
      .enterOtherHowChallengeIdentified('Chris has been observed by may people to struggle with empathy')
      .submitPageTo(ChallengesPage)

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .hasSuccessMessage('Challenge added')

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/challenges`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              '@.challenges.size() == 1 && ' +
              "@.challenges[0].prisonId == 'BXI' && " +
              "@.challenges[0].challengeTypeCode == 'EMOTIONS_FEELINGS_DEFAULT' && " +
              "@.challenges[0].symptoms == 'Chris struggles showing empathy when dealing with others' && " +
              '@.challenges[0].howIdentified.size() == 2 && ' +
              "@.challenges[0].howIdentified[0] == 'FORMAL_PROCESSES' && " +
              "@.challenges[0].howIdentified[1] == 'OTHER' && " +
              "@.challenges[0].howIdentifiedOther == 'Chris has been observed by may people to struggle with empathy' " +
              ')]',
          ),
        ),
    )
  })

  it('should not create a Challenge given API returns an error response', () => {
    // Given
    cy.task('stubCreateChallenges500Error', prisonNumber)

    cy.visit(`/challenges/${prisonNumber}/create/select-category`)

    Page.verifyOnPage(ChallengeCategoryPage)
      .selectCategory(ChallengeType.EMOTIONS_FEELINGS_DEFAULT)
      .submitPageTo(ChallengeDetailPage)
      .enterDescription('Chris struggles showing empathy when dealing with others')
      .selectHowChallengeIdentified(ChallengeIdentificationSource.FORMAL_PROCESSES)

    // When
    Page.verifyOnPage(ChallengeDetailPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ChallengeDetailPage) //
      .submitPageTo(ChallengeDetailPage) // Submit the page but expect to stay on the Add Challenge Detail page due to API error

    // Then
    Page.verifyOnPage(ChallengeDetailPage) //
      .apiErrorBannerIsDisplayed()
  })
})
