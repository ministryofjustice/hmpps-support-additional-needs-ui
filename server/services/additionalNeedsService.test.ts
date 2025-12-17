import { parseISO } from 'date-fns'
import type { ReferenceData } from 'supportAdditionalNeedsApiClient'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import AdditionalNeedsService from './additionalNeedsService'
import anAdditionalNeedsFactorsDto from '../testsupport/additionalNeedsFactorsDtoTestDataBuilder'
import anAdditionalNeedsFactorsResponse from '../testsupport/additionalNeedsFactorsResponseTestDataBuilder'
import SupportStrategyCategory from '../enums/supportStrategyCategory'
import SupportStrategyType from '../enums/supportStrategyType'
import StrengthType from '../enums/strengthType'
import StrengthCategory from '../enums/strengthCategory'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'
import ConditionType from '../enums/conditionType'
import ConditionSource from '../enums/conditionSource'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('additionalNeedsService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new AdditionalNeedsService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getAdditionalNeedFactors', () => {
    it('should get Additional Needs Factors', async () => {
      // Given
      const additionalNeedsFactorsResponse = anAdditionalNeedsFactorsResponse({
        strengths: [
          {
            prisonNumber,
            active: true,
            fromALNScreener: false,
            symptoms: 'John can read and understand very well.',
            strengthType: { code: 'READING_COMPREHENSION', categoryCode: 'LITERACY_SKILLS' },
            howIdentified: ['CONVERSATIONS'],
            howIdentifiedOther: 'I have spoken to the person',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
          },
        ],
        challenges: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            createdAtPrison: 'PR001',
            categoryCode: 'CC001',
            detail: 'Test detail',
            challengeType: { code: 'TYPE001', categoryCode: 'EMOTIONS_FEELINGS' } as ReferenceData,
            createdAt: '2025-07-25T12:00:00.000Z',
            createdBy: 'user1',
            createdByDisplayName: 'Bob Martin',
            updatedAt: '2025-07-26T12:00:00.000Z',
            updatedBy: 'user2',
            updatedByDisplayName: 'Dave Davidson',
            active: true,
            fromALNScreener: false,
            howIdentified: ['EDUCATION_SKILLS_WORK'],
            howIdentifiedOther: '',
            symptoms: 'Some varying symptoms',
            updatedAtPrison: 'BXI',
            alnScreenerDate: '2025-07-23T12:00:00.000Z',
          },
        ],
        conditions: [
          {
            active: false,
            source: 'SELF_DECLARED',
            conditionDetails:
              'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
            conditionType: { code: 'DYSLEXIA' },
            conditionName: 'Phonological dyslexia',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
            archiveReason: 'Created in error',
          },
        ],
        supportStrategies: [
          {
            supportStrategyType: { categoryCode: SupportStrategyCategory.MEMORY, code: SupportStrategyType.MEMORY },
            detail: 'Make sure to repeat things 3 times',
            createdAt: '2025-07-25T12:00:00.000Z',
            createdBy: 'user1',
            createdAtPrison: 'BXI',
            createdByDisplayName: 'Bob Martin',
            updatedByDisplayName: 'Dave Davidson',
            updatedAt: '2025-07-26T12:00:00.000Z',
            updatedBy: 'user2',
            updatedAtPrison: 'BXI',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            active: true,
          },
        ],
      })
      supportAdditionalNeedsApiClient.getAdditionalNeedsFactors.mockResolvedValue(additionalNeedsFactorsResponse)

      const expectedAdditionalNeedsFactors = anAdditionalNeedsFactorsDto({
        strengths: [
          {
            prisonNumber,
            active: true,
            fromALNScreener: false,
            alnScreenerDate: null,
            symptoms: 'John can read and understand very well.',
            strengthTypeCode: StrengthType.READING_COMPREHENSION,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            howIdentified: [StrengthIdentificationSource.CONVERSATIONS],
            howIdentifiedOther: 'I have spoken to the person',
            createdAt: parseISO('2023-06-19T09:39:44Z'),
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            updatedAt: parseISO('2023-06-19T09:39:44Z'),
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        ],
        challenges: [
          {
            prisonNumber,
            createdAtPrison: 'PR001',
            challengeCategory: 'EMOTIONS_FEELINGS',
            createdAt: parseISO('2025-07-25T12:00:00.000Z'),
            createdBy: 'user1',
            updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
            updatedBy: 'user2',
            updatedAtPrison: 'BXI',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            fromALNScreener: false,
            active: true,
            createdByDisplayName: 'Bob Martin',
            updatedByDisplayName: 'Dave Davidson',
            howIdentified: ['EDUCATION_SKILLS_WORK'],
            howIdentifiedOther: '',
            symptoms: 'Some varying symptoms',
            alnScreenerDate: parseISO('2025-07-23T12:00:00.000Z'),
            challengeTypeCode: 'TYPE001',
          },
        ],
        conditions: [
          {
            prisonId: null,
            active: false,
            prisonNumber,
            conditionDetails:
              'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
            conditionName: 'Phonological dyslexia',
            conditionTypeCode: ConditionType.DYSLEXIA,
            createdAt: parseISO('2023-06-19T09:39:44Z'),
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            source: ConditionSource.SELF_DECLARED,
            updatedAt: parseISO('2023-06-19T09:39:44Z'),
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            archiveReason: 'Created in error',
          },
        ],
        supportStrategies: [
          {
            prisonNumber,
            createdAtPrison: 'BXI',
            supportStrategyCategory: SupportStrategyCategory.MEMORY,
            supportStrategyTypeCode: SupportStrategyType.MEMORY,
            createdAt: parseISO('2025-07-25T12:00:00.000Z'),
            createdBy: 'user1',
            updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
            updatedBy: 'user2',
            updatedAtPrison: 'BXI',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            active: true,
            createdByDisplayName: 'Bob Martin',
            updatedByDisplayName: 'Dave Davidson',
            supportStrategyDetails: 'Make sure to repeat things 3 times',
          },
        ],
      })

      // When
      const actual = await service.getAdditionalNeedFactors(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedAdditionalNeedsFactors)
      expect(supportAdditionalNeedsApiClient.getAdditionalNeedsFactors).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty AdditionalNeedsFactorsDto given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getAdditionalNeedsFactors.mockResolvedValue(null)

      const expectedAdditionalNeedsFactors = anAdditionalNeedsFactorsDto({
        challenges: [],
        conditions: [],
        supportStrategies: [],
        strengths: [],
      })

      // When
      const actual = await service.getAdditionalNeedFactors(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedAdditionalNeedsFactors)
      expect(supportAdditionalNeedsApiClient.getAdditionalNeedsFactors).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getAdditionalNeedsFactors.mockRejectedValue(expectedError)

      // When
      const actual = await service.getAdditionalNeedFactors(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getAdditionalNeedsFactors).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
