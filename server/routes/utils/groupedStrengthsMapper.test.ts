import { startOfToday } from 'date-fns'
import type { AlnScreenerList, StrengthResponseDto, StrengthsList } from 'dto'
import toGroupedStrengthsPromise from './groupedStrengthsMapper'
import { Result } from '../../utils/result/result'
import {
  setupAlnScreenersPromise,
  setupAlnStrengths,
  setupNonAlnStrengths,
  setupNonAlnStrengthsPromise,
} from '../profile/profileTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'

describe('groupedStrengthsMapper', () => {
  const prisonId = 'MDI'

  // Non-ALN strengths
  const { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking } = setupNonAlnStrengths()
  const strengths = setupNonAlnStrengthsPromise({
    strengths: [numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking],
  })

  // Latest ALN strengths
  const { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness } =
    setupAlnStrengths()
  const screenerDate = startOfToday()
  const latestScreener = aValidAlnScreenerResponseDto({
    screenerDate,
    createdAtPrison: prisonId,
    strengths: [reading, writing, wordFindingNonActive, arithmetic, focussing, tidiness, alphabetOrdering],
  })
  const alnScreeners = setupAlnScreenersPromise({ latestScreener })

  describe('toGroupedStrengthsPromise', () => {
    it('should map to GroupedStrengths given the strengths and alnScreeners promises are fulfilled', () => {
      // Given
      const expectedGroupedStrengths = {
        ATTENTION_ORGANISING_TIME: {
          nonAlnStrengths: [attention],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            strengths: [focussing, tidiness],
          },
        },
        LITERACY_SKILLS: {
          nonAlnStrengths: [literacy],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            strengths: [alphabetOrdering, reading, writing],
          },
        },
        NUMERACY_SKILLS: {
          nonAlnStrengths: [numeracy2, numeracy],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            strengths: [arithmetic],
          },
        },
        LANGUAGE_COMM_SKILLS: {
          nonAlnStrengths: [speaking],
          latestAlnScreener: {
            screenerDate,
            createdAtPrison: prisonId,
            strengths: [] as Array<StrengthResponseDto>,
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
        value: expectedGroupedStrengths,
      })

      // When
      const actual = toGroupedStrengthsPromise(strengths, alnScreeners)

      // Then
      expect(actual).toEqual(expected)
      const actualGroupedStrengths = actual.getOrThrow()
      const actualCategoryOrder = Object.keys(actualGroupedStrengths)
      expect(actualCategoryOrder).toEqual(expectedCategoryOrder)
    })

    it('should map to GroupedStrengths given the strengths promise is not resolved', () => {
      // Given
      const rejectedStrengthsPromise: Result<StrengthsList> = Result.rejected(
        new Error('Some error retrieving strengths'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving strengths'),
      })

      // When
      const actual = toGroupedStrengthsPromise(rejectedStrengthsPromise, alnScreeners)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to GroupedStrengths given the ALN Screeners promise is not resolved', () => {
      // Given
      const rejectedAlnScreenersPromise: Result<AlnScreenerList> = Result.rejected(
        new Error('Some error retrieving ALN Screeners'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving ALN Screeners'),
      })

      // When
      const actual = toGroupedStrengthsPromise(strengths, rejectedAlnScreenersPromise)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to GroupedStrengths given both the Strengths and ALN Screeners promises are not resolved', () => {
      // Given
      const rejectedStrengthsPromise: Result<StrengthsList> = Result.rejected(
        new Error('Some error retrieving strengths'),
      )
      const rejectedAlnScreenersPromise: Result<AlnScreenerList> = Result.rejected(
        new Error('Some error retrieving ALN Screeners'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving ALN Screeners, Some error retrieving strengths'),
      })

      // When
      const actual = toGroupedStrengthsPromise(rejectedStrengthsPromise, rejectedAlnScreenersPromise)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
