import { parseISO } from 'date-fns'
import type { AdditionalNeedsFactorsResponse, ReferenceData } from 'supportAdditionalNeedsApiClient'
import toAdditionalNeedsFactorsDto from './additionalNeedsFactorsDtoMapper'
import anAdditionalNeedsFactorsDto from '../../testsupport/additionalNeedsFactorsDtoTestDataBuilder'
import anAdditionalNeedsFactorsResponse from '../../testsupport/additionalNeedsFactorsResponseTestDataBuilder'
import StrengthType from '../../enums/strengthType'
import StrengthCategory from '../../enums/strengthCategory'
import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
import ConditionType from '../../enums/conditionType'
import ConditionSource from '../../enums/conditionSource'
import SupportStrategyCategory from '../../enums/supportStrategyCategory'
import SupportStrategyType from '../../enums/supportStrategyType'

describe('additionalNeedsFactorsDtoMapper', () => {
  const prisonNumber = 'A1234BC'

  describe('toAdditionalNeedsFactorsDto', () => {
    it('should map an AdditionalNeedsFactorsResponse to an AdditionalNeedsFactorsDto', () => {
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

      const expected = anAdditionalNeedsFactorsDto({
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
      const actual = toAdditionalNeedsFactorsDto(prisonNumber, additionalNeedsFactorsResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a null AdditionalNeedsFactorsResponse to an empty AdditionalNeedsFactorsDto', () => {
      // Given
      const additionalNeedsFactorsResponse: AdditionalNeedsFactorsResponse = null

      const expected = anAdditionalNeedsFactorsDto({
        conditions: [],
        challenges: [],
        supportStrategies: [],
        strengths: [],
      })

      // When
      const actual = toAdditionalNeedsFactorsDto(prisonNumber, additionalNeedsFactorsResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
