import { startOfToday } from 'date-fns'
import aValidAlnScreenerDto from '../../testsupport/alnScreenerDtoTestDataBuilder'
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
})
