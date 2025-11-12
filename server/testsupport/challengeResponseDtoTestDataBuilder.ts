import type { ChallengeResponseDto } from 'dto'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import ChallengeType from '../enums/challengeType'
import ChallengeCategory from '../enums/challengeCategory'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

const aValidChallengeResponseDto = (
  options?: DtoAuditFields & {
    prisonNumber?: string
    challengeTypeCode?: ChallengeType
    challengeCategory?: ChallengeCategory
    symptoms?: string
    howIdentified?: Array<ChallengeIdentificationSource>
    howIdentifiedOther?: string
    active?: boolean
    fromALNScreener?: boolean
    alnScreenerDate?: Date
    archiveReason?: string
  },
): ChallengeResponseDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  challengeTypeCode: options?.challengeTypeCode || ChallengeType.READING_COMPREHENSION,
  challengeCategory: options?.challengeCategory || ChallengeCategory.LITERACY_SKILLS,
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || [ChallengeIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
  active: options?.active == null ? true : options?.active,
  fromALNScreener: options?.fromALNScreener == null ? true : options?.fromALNScreener,
  alnScreenerDate: options?.alnScreenerDate === null ? null : options?.alnScreenerDate,
  archiveReason: options?.archiveReason,
  ...validDtoAuditFields(options),
})

export default aValidChallengeResponseDto
