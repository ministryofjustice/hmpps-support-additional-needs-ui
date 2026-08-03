import { parseISO, startOfToday } from 'date-fns'
import type { AlnScreenerList, ChallengeResponseDto, SupportStrategyResponseDto } from 'dto'
import toGroupedChallengesAndSupportPromise, { GroupedChallengesAndSupport } from './groupedChallengesAndSupportMapper'
import { Result } from '../../utils/result/result'
import {
  setupAlnChallenges,
  setupAlnScreenersPromise,
  setupNonAlnChallenges,
  setupNonAlnChallengesPromise,
} from '../profile/profileTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'
import aValidSupportStrategyResponseDto from '../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../enums/supportStrategyType'
import SupportStrategyCategory from '../../enums/supportStrategyCategory'

describe('groupedChallengesAndSupportMapper', () => {
  const prisonId = 'MDI'

  // Non-ALN challenges
  const {
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  } = setupNonAlnChallenges()
  const challenges = setupNonAlnChallengesPromise([
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  ])

  // Latest ALN challenges
  const {
    readingChallenge,
    writingChallenge,
    alphabetOrderingChallenge,
    wordFindingNonActiveChallenge,
    arithmeticChallenge,
    focussingChallenge,
    tidinessChallenge,
  } = setupAlnChallenges()
  const screenerDate = startOfToday()
  const latestScreener = aValidAlnScreenerResponseDto({
    screenerDate,
    createdAtPrison: prisonId,
    challenges: [
      readingChallenge,
      writingChallenge,
      wordFindingNonActiveChallenge,
      arithmeticChallenge,
      focussingChallenge,
      tidinessChallenge,
      alphabetOrderingChallenge,
    ],
  })
  const alnScreeners = setupAlnScreenersPromise({ latestScreener })

  // Support strategies
  const oldestActiveSensorySupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
    supportStrategyCategory: SupportStrategyCategory.SENSORY,
    updatedAt: parseISO('2021-01-01T00:00:00.000Z'),
    createdAt: parseISO('2021-01-01T00:00:00.000Z'),
    details: 'This is the oldest entry',
    active: true,
  })
  const recentActiveSensorySupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
    supportStrategyCategory: SupportStrategyCategory.SENSORY,
    updatedAt: parseISO('2021-01-02T00:00:00.000Z'),
    createdAt: parseISO('2021-01-02T00:00:00.000Z'),
    details: 'This is the newer entry',
    active: true,
  })
  const memoryActiveSupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
    supportStrategyCategory: SupportStrategyCategory.MEMORY,
    active: true,
  })
  const generalActiveSupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.GENERAL,
    active: true,
  })
  const literacySkillsNonActiveSupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
    supportStrategyCategory: SupportStrategyCategory.LITERACY_SKILLS,
    active: false,
  })

  const supportStrategies: Result<Array<SupportStrategyResponseDto>, Error> = Result.fulfilled([
    oldestActiveSensorySupportStrategy,
    recentActiveSensorySupportStrategy,
    memoryActiveSupportStrategy,
    generalActiveSupportStrategy,
    literacySkillsNonActiveSupportStrategy,
  ])

  describe('toGroupedChallengesAndSupportPromise', () => {
    it('should map active challenges and support to GroupedChallenges', () => {
      // Given
      const expectedGroupedChallengesAndSupport: GroupedChallengesAndSupport = {
        ATTENTION_ORGANISING_TIME: {
          nonAlnChallenges: [attentionChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [focussingChallenge, tidinessChallenge],
          },
          supportStrategies: [],
        },
        LITERACY_SKILLS: {
          nonAlnChallenges: [literacyChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [alphabetOrderingChallenge, readingChallenge, writingChallenge],
          },
          supportStrategies: [],
        },
        NUMERACY_SKILLS: {
          nonAlnChallenges: [numeracy2Challenge, numeracyChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [arithmeticChallenge],
          },
          supportStrategies: [],
        },
        LANGUAGE_COMM_SKILLS: {
          nonAlnChallenges: [speakingChallenge],
          latestAlnScreener: null,
          supportStrategies: [],
        },
        MEMORY: {
          nonAlnChallenges: [],
          latestAlnScreener: null,
          supportStrategies: [memoryActiveSupportStrategy],
        },
        GENERAL: {
          nonAlnChallenges: [],
          latestAlnScreener: null,
          supportStrategies: [generalActiveSupportStrategy],
        },
        SENSORY: {
          nonAlnChallenges: [],
          latestAlnScreener: null,
          supportStrategies: [recentActiveSensorySupportStrategy, oldestActiveSensorySupportStrategy],
        },
      }
      const expectedCategoryOrder = [
        'ATTENTION_ORGANISING_TIME',
        'LANGUAGE_COMM_SKILLS',
        'LITERACY_SKILLS',
        'MEMORY',
        'NUMERACY_SKILLS',
        'SENSORY',
        'GENERAL',
      ]

      const expected = expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedChallengesAndSupport,
      })

      // When
      const actual = toGroupedChallengesAndSupportPromise({ challenges, alnScreeners, supportStrategies, active: true })

      // Then
      expect(actual).toEqual(expected)
      const actualGroupedChallenges = actual.getOrThrow()
      const actualCategoryOrder = Object.keys(actualGroupedChallenges)
      expect(actualCategoryOrder).toEqual(expectedCategoryOrder)
    })

    it('should map inactive challenges and support to GroupedChallenges', () => {
      // Given
      const expectedGroupedChallengesAndSupport: GroupedChallengesAndSupport = {
        EMOTIONS_FEELINGS: {
          nonAlnChallenges: [emotionsNonActiveChallenge],
          latestAlnScreener: null,
          supportStrategies: [],
        },
        LITERACY_SKILLS: {
          nonAlnChallenges: [] as Array<ChallengeResponseDto>,
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [wordFindingNonActiveChallenge],
          },
          supportStrategies: [literacySkillsNonActiveSupportStrategy],
        },
      }
      const expectedCategoryOrder = ['EMOTIONS_FEELINGS', 'LITERACY_SKILLS']

      const expected = expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedChallengesAndSupport,
      })

      // When
      const actual = toGroupedChallengesAndSupportPromise({
        challenges,
        alnScreeners,
        supportStrategies,
        active: false,
      })

      // Then
      expect(actual).toEqual(expected)
      const actualGroupedChallenges = actual.getOrThrow()
      const actualCategoryOrder = Object.keys(actualGroupedChallenges)
      expect(actualCategoryOrder).toEqual(expectedCategoryOrder)
    })

    it('should map to GroupedChallenges given the challenges promise is not resolved', () => {
      // Given
      const rejectedChallengesPromise: Result<Array<ChallengeResponseDto>> = Result.rejected(
        new Error('Some error retrieving challenges'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving challenges'),
      })

      // When
      const actual = toGroupedChallengesAndSupportPromise({
        challenges: rejectedChallengesPromise,
        alnScreeners,
        supportStrategies,
        active: true,
      })

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to GroupedChallenges given the ALN Screeners promise is not resolved', () => {
      // Given
      const rejectedAlnScreenersPromise: Result<AlnScreenerList> = Result.rejected(
        new Error('Some error retrieving ALN Screeners'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving ALN Screeners'),
      })

      // When
      const actual = toGroupedChallengesAndSupportPromise({
        challenges,
        alnScreeners: rejectedAlnScreenersPromise,
        supportStrategies,
        active: true,
      })

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to GroupedChallenges given the Support Strategies promise is not resolved', () => {
      // Given
      const rejectedSupportStrategiesPromise: Result<Array<SupportStrategyResponseDto>> = Result.rejected(
        new Error('Some error retrieving Support Strategies'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving Support Strategies'),
      })

      // When
      const actual = toGroupedChallengesAndSupportPromise({
        challenges,
        alnScreeners,
        supportStrategies: rejectedSupportStrategiesPromise,
        active: true,
      })

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to GroupedChallenges given none of the promises are resolved', () => {
      // Given
      const rejectedChallengesPromise: Result<Array<ChallengeResponseDto>> = Result.rejected(
        new Error('Some error retrieving challenges'),
      )
      const rejectedAlnScreenersPromise: Result<AlnScreenerList> = Result.rejected(
        new Error('Some error retrieving ALN Screeners'),
      )
      const rejectedSupportStrategiesPromise: Result<Array<SupportStrategyResponseDto>> = Result.rejected(
        new Error('Some error retrieving Support Strategies'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error(
          'Some error retrieving ALN Screeners, Some error retrieving challenges, Some error retrieving Support Strategies',
        ),
      })

      // When
      const actual = toGroupedChallengesAndSupportPromise({
        challenges: rejectedChallengesPromise,
        alnScreeners: rejectedAlnScreenersPromise,
        supportStrategies: rejectedSupportStrategiesPromise,
        active: true,
      })

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
