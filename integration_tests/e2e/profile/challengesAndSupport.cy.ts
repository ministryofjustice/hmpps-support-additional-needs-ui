/**
 * Cypress scenarios for the Profile Challenges & Support page.
 */

import { format, startOfToday, subDays } from 'date-fns'
import Page from '../../pages/page'
import { aValidAlnScreenerResponse } from '../../../server/testsupport/alnScreenerResponseTestDataBuilder'
import { aValidStrengthResponse } from '../../../server/testsupport/strengthResponseTestDataBuilder'
import { aValidChallengeResponse } from '../../../server/testsupport/challengeResponseTestDataBuilder'
import ChallengesAndSupportPage from '../../pages/profile/challengesAndSupportPage'
import ChallengeIdentificationSource from '../../../server/enums/challengeIdentificationSource'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'
import { aValidSupportStrategyResponse } from '../../../server/testsupport/supportStrategyResponseTestDataBuilder'
import SupportStrategyType from '../../../server/enums/supportStrategyType'

context('Profile Challenges & Support Page', () => {
  const prisonNumber = 'A00001A'

  const today = startOfToday()
  const yesterday = subDays(today, 1)
  const lastWeek = subDays(today, 7)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  describe('render challenges', () => {
    it('should render the Challenges and Support page given the prisoner has both manually recorded challenges and challenges on an ALN Screener', () => {
      // Given
      cy.task('stubGetChallenges', {
        prisonNumber,
        challenges: [
          aValidChallengeResponse({
            challengeTypeCode: 'READING_COMPREHENSION',
            challengeCategory: 'LITERACY_SKILLS',
            howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
            fromALNScreener: false,
            symptoms: 'John struggles with all things literacy',
          }),
          aValidChallengeResponse({
            challengeTypeCode: 'MATHS_LITERACY',
            challengeCategory: 'NUMERACY_SKILLS',
            howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
            fromALNScreener: false,
            symptoms: 'John struggles with adding',
          }),
        ],
      })
      cy.task('stubGetAlnScreeners', {
        prisonNumber,
        screeners: [
          aValidAlnScreenerResponse({
            screenerDate: format(yesterday, 'yyyy-MM-dd'),
            strengths: [aValidStrengthResponse()],
          }),
          aValidAlnScreenerResponse({
            screenerDate: format(today, 'yyyy-MM-dd'),
            strengths: [],
            challenges: [
              aValidChallengeResponse({
                challengeTypeCode: 'MATHS_LITERACY',
                challengeCategory: 'NUMERACY_SKILLS',
                howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
                fromALNScreener: true,
              }),
              aValidChallengeResponse({
                challengeTypeCode: 'READING_COMPREHENSION',
                challengeCategory: 'LITERACY_SKILLS',
                howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
                fromALNScreener: true,
                symptoms: 'John struggles with all things literacy',
              }),
            ],
          }),
          aValidAlnScreenerResponse({
            screenerDate: format(lastWeek, 'yyyy-MM-dd'),
            strengths: [aValidStrengthResponse()],
            challenges: [
              aValidChallengeResponse({
                challengeTypeCode: 'STAMINA',
                challengeCategory: 'PHYSICAL_SKILLS',
                howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
                fromALNScreener: true,
              }),
            ],
          }),
        ],
      })

      // When
      cy.visit(`/profile/${prisonNumber}/challenges-and-support`)

      // Then
      Page.verifyOnPage(ChallengesAndSupportPage) //
        .hasActiveChallengesSummaryCard(ChallengeCategory.NUMERACY_SKILLS)
        .hasActiveNonAlnChallenges(ChallengeCategory.NUMERACY_SKILLS, ChallengeType.MATHS_LITERACY)
        .hasActiveAlnChallenges(ChallengeCategory.NUMERACY_SKILLS, 'Maths literacy')
        .hasActiveChallengesSummaryCard(ChallengeCategory.LITERACY_SKILLS)
        .hasActiveNonAlnChallenges(ChallengeCategory.LITERACY_SKILLS, ChallengeType.READING_COMPREHENSION)
        .hasActiveAlnChallenges(ChallengeCategory.LITERACY_SKILLS, 'Reading comprehension')
        // Verify that there is not a Physical skills card as it was from an older screener result.
        .hasNoActiveChallengesSummaryCard(ChallengeCategory.PHYSICAL_SKILLS)
        .apiErrorBannerIsNotDisplayed()
    })

    it('should render the Challenges and Support page given the prisoner has no manually recorded challenges or challenges on an ALN Screener', () => {
      // Given
      cy.task('stubGetChallenges', { prisonNumber, challenges: [] })

      // When
      cy.visit(`/profile/${prisonNumber}/challenges-and-support`)

      // Then
      Page.verifyOnPage(ChallengesAndSupportPage) //
        .hasNoActiveChallenges()
        .apiErrorBannerIsNotDisplayed()
    })

    it('should render the Challenges and Support page given the API to get Challenges returns an error', () => {
      // Given
      cy.task('stubGetChallenges500Error', prisonNumber)

      // When
      cy.visit(`/profile/${prisonNumber}/challenges-and-support`)

      // Then
      Page.verifyOnPage(ChallengesAndSupportPage) //
        .apiErrorBannerIsDisplayed()
    })
  })

  describe('render support strategies', () => {
    it('should render the Challenges and Support page given the prisoner has one Support Strategy recorded', () => {
      // Given
      cy.task('stubGetSupportStrategies', {
        prisonNumber,
        supportStrategies: [
          aValidSupportStrategyResponse({
            supportStrategyType: 'MEMORY',
            supportStrategyCategory: 'MEMORY',
            detail: 'Support to be given via structured reading programme',
          }),
          aValidSupportStrategyResponse({
            supportStrategyType: 'SENSORY',
            supportStrategyCategory: 'SENSORY',
            detail: 'Have some nice soft things',
          }),
        ],
      })

      // When
      cy.visit(`/profile/${prisonNumber}/challenges-and-support`)

      // Then
      Page.verifyOnPage(ChallengesAndSupportPage) //
        .hasActiveSupportStrategySummaryCard(SupportStrategyType.MEMORY)
        .hasActiveSupportStrategySummaryCard(SupportStrategyType.SENSORY)
        .apiErrorBannerIsNotDisplayed()
    })

    it('should render the Challenges and Support page given the prisoner has no Support Strategies recorded', () => {
      // Given
      cy.task('stubGetSupportStrategies', { prisonNumber, supportStrategies: [] })

      // When
      cy.visit(`/profile/${prisonNumber}/challenges-and-support`)

      // Then
      Page.verifyOnPage(ChallengesAndSupportPage) //
        .hasNoActiveSupportStrategies()
        .apiErrorBannerIsNotDisplayed()
    })

    it('should render the Challenges and Support page given the API to get Support Strategies returns an error', () => {
      // Given
      cy.task('stubGetSupportStrategies500Error', prisonNumber)

      // When
      cy.visit(`/profile/${prisonNumber}/challenges-and-support`)

      // Then
      Page.verifyOnPage(ChallengesAndSupportPage) //
        .apiErrorBannerIsDisplayed()
    })
  })
})
