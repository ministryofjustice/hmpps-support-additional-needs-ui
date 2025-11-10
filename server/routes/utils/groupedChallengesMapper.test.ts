import { startOfToday } from 'date-fns'
import type { AlnScreenerList, ChallengeResponseDto } from 'dto'
import toGroupedChallengesPromise from './groupedChallengesMapper'
import { Result } from '../../utils/result/result'
import {
  setupAlnScreenersPromise,
  setupAlnChallenges,
  setupNonAlnChallenges,
  setupNonAlnChallengesPromise,
} from '../profile/profileTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'

describe('groupedChallengesMapper', () => {
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

  describe('toGroupedChallengesPromise', () => {
    it('should map active challenges to GroupedChallenges given the challenges and alnScreeners promises are fulfilled', () => {
      // Given
      const expectedGroupedChallenges = {
        ATTENTION_ORGANISING_TIME: {
          nonAlnChallenges: [attentionChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [focussingChallenge, tidinessChallenge],
          },
        },
        LITERACY_SKILLS: {
          nonAlnChallenges: [literacyChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [alphabetOrderingChallenge, readingChallenge, writingChallenge],
          },
        },
        NUMERACY_SKILLS: {
          nonAlnChallenges: [numeracy2Challenge, numeracyChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [arithmeticChallenge],
          },
        },
        LANGUAGE_COMM_SKILLS: {
          nonAlnChallenges: [speakingChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [] as Array<ChallengeResponseDto>,
          },
        },
      }
      const expectedCategoryOrder = [
        'ATTENTION_ORGANISING_TIME',
        'LANGUAGE_COMM_SKILLS',
        'LITERACY_SKILLS',
        'NUMERACY_SKILLS',
      ]

      const expected = expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedChallenges,
      })

      // When
      const actual = toGroupedChallengesPromise({ challenges, alnScreeners, active: true })

      // Then
      expect(actual).toEqual(expected)
      const actualGroupedChallenges = actual.getOrThrow()
      const actualCategoryOrder = Object.keys(actualGroupedChallenges)
      expect(actualCategoryOrder).toEqual(expectedCategoryOrder)
    })

    it('should map inactive challenges to GroupedChallenges given the challenges and alnScreeners promises are fulfilled', () => {
      // Given
      const expectedGroupedChallenges = {
        EMOTIONS_FEELINGS: {
          nonAlnChallenges: [emotionsNonActiveChallenge],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [] as Array<ChallengeResponseDto>,
          },
        },
        LITERACY_SKILLS: {
          nonAlnChallenges: [] as Array<ChallengeResponseDto>,
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            challenges: [wordFindingNonActiveChallenge],
          },
        },
      }
      const expectedCategoryOrder = ['EMOTIONS_FEELINGS', 'LITERACY_SKILLS']

      const expected = expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedChallenges,
      })

      // When
      const actual = toGroupedChallengesPromise({ challenges, alnScreeners, active: false })

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
      const actual = toGroupedChallengesPromise({ challenges: rejectedChallengesPromise, alnScreeners, active: true })

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
      const actual = toGroupedChallengesPromise({ challenges, alnScreeners: rejectedAlnScreenersPromise, active: true })

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to GroupedChallenges given both the Challenges and ALN Screeners promises are not resolved', () => {
      // Given
      const rejectedChallengesPromise: Result<Array<ChallengeResponseDto>> = Result.rejected(
        new Error('Some error retrieving challenges'),
      )
      const rejectedAlnScreenersPromise: Result<AlnScreenerList> = Result.rejected(
        new Error('Some error retrieving ALN Screeners'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving ALN Screeners, Some error retrieving challenges'),
      })

      // When
      const actual = toGroupedChallengesPromise({
        challenges: rejectedChallengesPromise,
        alnScreeners: rejectedAlnScreenersPromise,
        active: true,
      })

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
