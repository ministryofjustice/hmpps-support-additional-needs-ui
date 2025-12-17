import type { AdditionalNeedsFactorsDto } from 'dto'
import type {
  AdditionalNeedsFactorsResponse,
  ChallengeResponse,
  ConditionResponse,
  StrengthResponse,
  SupportStrategyResponse,
} from 'supportAdditionalNeedsApiClient'
import { toChallengeResponseDto } from './challengeDtoMapper'
import { toConditionDto } from './conditionDtoMapper'
import { toStrengthResponseDto } from './strengthResponseDtoMapper'
import { toSupportStrategyResponseDto } from './supportStrategyResponseDtoMapper'

const toAdditionalNeedsFactorsDto = (
  prisonNumber: string,
  additionalNeedsFactorsResponse: AdditionalNeedsFactorsResponse,
): AdditionalNeedsFactorsDto => ({
  challenges: (additionalNeedsFactorsResponse?.challenges || []).map((challenge: ChallengeResponse) =>
    toChallengeResponseDto(prisonNumber, challenge),
  ),
  conditions: (additionalNeedsFactorsResponse?.conditions || []).map((condition: ConditionResponse) =>
    toConditionDto(prisonNumber, condition),
  ),
  strengths: (additionalNeedsFactorsResponse?.strengths || []).map((strength: StrengthResponse) =>
    toStrengthResponseDto(prisonNumber, strength),
  ),
  supportStrategies: (additionalNeedsFactorsResponse?.supportStrategies || []).map(
    (supportStrategy: SupportStrategyResponse) => toSupportStrategyResponseDto(prisonNumber, supportStrategy),
  ),
})

export default toAdditionalNeedsFactorsDto
