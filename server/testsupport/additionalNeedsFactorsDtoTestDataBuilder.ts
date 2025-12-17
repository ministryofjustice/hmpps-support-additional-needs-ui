import type {
  AdditionalNeedsFactorsDto,
  ChallengeResponseDto,
  ConditionDto,
  StrengthResponseDto,
  SupportStrategyResponseDto,
} from 'dto'
import { aValidConditionDto } from './conditionDtoTestDataBuilder'
import aValidChallengeResponseDto from './challengeResponseDtoTestDataBuilder'
import { aValidStrengthResponseDto } from './strengthResponseDtoTestDataBuilder'
import aValidSupportStrategyResponseDto from './supportStrategyResponseDtoTestDataBuilder'

const anAdditionalNeedsFactorsDto = (options?: {
  conditions?: Array<ConditionDto>
  challenges?: Array<ChallengeResponseDto>
  strengths?: Array<StrengthResponseDto>
  supportStrategies?: Array<SupportStrategyResponseDto>
}): AdditionalNeedsFactorsDto => ({
  conditions: options?.conditions || [aValidConditionDto()],
  challenges: options?.challenges || [aValidChallengeResponseDto()],
  strengths: options?.strengths || [aValidStrengthResponseDto()],
  supportStrategies: options?.supportStrategies || [aValidSupportStrategyResponseDto()],
})

export default anAdditionalNeedsFactorsDto
