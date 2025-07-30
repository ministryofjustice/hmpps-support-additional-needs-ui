import { parseISO } from 'date-fns'

import type { ChallengeListResponse, ReferenceData } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto, ReferenceDataItemDto } from 'dto'
import toChallengeDto from './challengeDtoMapper'

describe('toChallengeDto', () => {
  it('should map a single challenge correctly', () => {
    const prisonNumber = 'A1234BC'
    const testRef = 'abcdef'
    const apiResponse: ChallengeListResponse = {
      challenges: [
        {
          reference: testRef,
          id: 'CH001',
          createdAtPrison: 'PR001',
          categoryCode: 'CC001',
          detail: 'Test detail',
          challengeType: { code: 'TYPE001' } as ReferenceData,
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
        },
      ],
    }

    const result = toChallengeDto(prisonNumber, apiResponse)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<ChallengeResponseDto>({
      prisonNumber: 'A1234BC',
      createdAtPrison: 'PR001',
      challengeType: { code: 'TYPE001', areaCode: undefined } as ReferenceDataItemDto,
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef,
      fromALNScreener: false,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: '',
      symptoms: 'Some varying symptoms',
    })
  })

  it('should map a multiple challenges correctly', () => {
    const prisonNumber = 'A1234BC'
    const testRef1 = 'abcdef'
    const testRef2 = 'xyz789'
    const apiResponse: ChallengeListResponse = {
      challenges: [
        {
          reference: testRef1,
          id: 'CH001',
          createdAtPrison: 'PR001',
          categoryCode: 'CC001',
          detail: 'Test detail',
          challengeType: { code: 'TYPE001' } as ReferenceData,
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
        },
        {
          reference: testRef2,
          id: 'CH002',
          createdAtPrison: 'PR001',
          categoryCode: 'CC001',
          detail: 'Test detail',
          challengeType: { code: 'TYPE001' } as ReferenceData,
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdByDisplayName: 'Bob Martin 2',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedByDisplayName: 'Dave Davidson 2',
          active: true,
          fromALNScreener: true,
          howIdentified: ['WIDER_PRISON'],
          howIdentifiedOther: '',
          symptoms: 'Some varying symptoms',
          updatedAtPrison: 'BXI',
        },
      ],
    }

    const result = toChallengeDto(prisonNumber, apiResponse)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual<ChallengeResponseDto>({
      prisonNumber: 'A1234BC',
      createdAtPrison: 'PR001',
      challengeType: { code: 'TYPE001', areaCode: undefined } as ReferenceDataItemDto,
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef1,
      fromALNScreener: false,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: '',
      symptoms: 'Some varying symptoms',
    })
    expect(result[1]).toEqual<ChallengeResponseDto>({
      prisonNumber: 'A1234BC',
      createdAtPrison: 'PR001',
      challengeType: { code: 'TYPE001', areaCode: undefined } as ReferenceDataItemDto,
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef2,
      fromALNScreener: true,
      active: true,
      createdByDisplayName: 'Bob Martin 2',
      updatedByDisplayName: 'Dave Davidson 2',
      howIdentified: ['WIDER_PRISON'],
      howIdentifiedOther: '',
      symptoms: 'Some varying symptoms',
    })
  })

  it('should handle empty `challenges` array', () => {
    const prisonNumber = 'C9012EF'
    const apiResponse: ChallengeListResponse = { challenges: [] }
    const result = toChallengeDto(prisonNumber, apiResponse)

    expect(result).toHaveLength(0)
  })
})
