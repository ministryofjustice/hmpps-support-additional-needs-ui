import { parseISO } from 'date-fns'
import { toAlnScreenerList } from './alnScreenerResponseDtoMapper'
import { aValidAlnScreenerList } from '../../testsupport/alnScreenerDtoTestDataBuilder'
import { aValidAlnScreeners } from '../../testsupport/alnScreenerResponseTestDataBuilder'
import { aValidChallengeResponse } from '../../testsupport/challengeResponseTestDataBuilder'
import { aValidStrengthResponse } from '../../testsupport/strengthResponseTestDataBuilder'
import ChallengeType from '../../enums/challengeType'
import ChallengeCategory from '../../enums/challengeCategory'
import StrengthType from '../../enums/strengthType'
import StrengthCategory from '../../enums/strengthCategory'
import { aValidStrengthResponseDto } from '../../testsupport/strengthResponseDtoTestDataBuilder'

describe('alnScreenerResponseDtoMapper', () => {
  it('should map ALNScreeners to an AlnScreenerList', () => {
    // Given
    const prisonNumber = 'A1234BC'

    const challenge = aValidChallengeResponse()
    challenge.challengeType.code = 'LITERACY_SKILLS_DEFAULT'
    challenge.challengeType.categoryCode = 'LITERACY_SKILLS'
    const strength = aValidStrengthResponse({ fromALNScreener: true, alnScreenerDate: '2025-05-13' })
    strength.strengthType.code = 'NUMERACY_SKILLS_DEFAULT'
    strength.strengthType.categoryCode = 'NUMERACY_SKILLS'

    const apiResponse = aValidAlnScreeners({
      screeners: [
        {
          screenerDate: '2025-05-13',
          challenges: [challenge],
          strengths: [strength],
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
    })

    const expected = aValidAlnScreenerList({
      prisonNumber,
      screeners: [
        {
          screenerDate: parseISO('2025-05-13'),
          challenges: [
            {
              challengeTypeCode: ChallengeType.LITERACY_SKILLS_DEFAULT,
              challengeCategory: ChallengeCategory.LITERACY_SKILLS,
            },
          ],
          strengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
              strengthCategory: StrengthCategory.NUMERACY_SKILLS,
              fromALNScreener: true,
              alnScreenerDate: parseISO('2025-05-13'),
            }),
          ],
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      ],
    })

    // When
    const actual = toAlnScreenerList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })

  it.each([null, undefined])('should map %s ALNScreeners to an empty AlnScreenerList', alnScreeners => {
    // Given
    const prisonNumber = 'A1234BC'
    const apiResponse = alnScreeners

    const expected = aValidAlnScreenerList({
      prisonNumber,
      screeners: [],
    })

    // When
    const actual = toAlnScreenerList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })
})
