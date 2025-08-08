import { startOfToday } from 'date-fns'
import { aValidAlnScreenerDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'
import { aValidAlnScreenerRequest } from '../../testsupport/alnScreenerRequestTestDataBuilder'
import toAlnScreenerRequest from './alnScreenerRequestMapper'
import ChallengeType from '../../enums/challengeType'
import StrengthType from '../../enums/strengthType'

describe('alnScreenerRequestMapper', () => {
  it('should map an AlnScreenerDto to an AlnScreenerRequest', () => {
    // Given
    const alnScreenerDto = aValidAlnScreenerDto({
      prisonId: 'MDI',
      screenerDate: startOfToday(),
      challenges: [ChallengeType.ARITHMETIC, ChallengeType.NUMBER_RECALL],
      strengths: [StrengthType.READING, StrengthType.LISTENING],
    })

    const expected = aValidAlnScreenerRequest({
      prisonId: 'MDI',
      screenerDate: startOfToday(),
      challenges: [{ challengeTypeCode: ChallengeType.ARITHMETIC }, { challengeTypeCode: ChallengeType.NUMBER_RECALL }],
      strengths: [{ strengthTypeCode: StrengthType.READING }, { strengthTypeCode: StrengthType.LISTENING }],
    })

    // When
    const actual = toAlnScreenerRequest(alnScreenerDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map an AlnScreenerDto to an AlnScreenerRequest given challenges is NONE', () => {
    // Given
    const alnScreenerDto = aValidAlnScreenerDto({
      prisonId: 'MDI',
      screenerDate: startOfToday(),
      challenges: [ChallengeType.NONE],
      strengths: [StrengthType.READING, StrengthType.LISTENING],
    })

    const expected = aValidAlnScreenerRequest({
      prisonId: 'MDI',
      screenerDate: startOfToday(),
      challenges: [], // expect NONE to be mapped as an empty array
      strengths: [{ strengthTypeCode: StrengthType.READING }, { strengthTypeCode: StrengthType.LISTENING }],
    })

    // When
    const actual = toAlnScreenerRequest(alnScreenerDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map an AlnScreenerDto to an AlnScreenerRequest given strengths is NONE', () => {
    // Given
    const alnScreenerDto = aValidAlnScreenerDto({
      prisonId: 'MDI',
      screenerDate: startOfToday(),
      challenges: [ChallengeType.ARITHMETIC, ChallengeType.NUMBER_RECALL],
      strengths: [StrengthType.NONE],
    })

    const expected = aValidAlnScreenerRequest({
      prisonId: 'MDI',
      screenerDate: startOfToday(),
      challenges: [{ challengeTypeCode: ChallengeType.ARITHMETIC }, { challengeTypeCode: ChallengeType.NUMBER_RECALL }],
      strengths: [], // expect NONE to be mapped as an empty array
    })

    // When
    const actual = toAlnScreenerRequest(alnScreenerDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
