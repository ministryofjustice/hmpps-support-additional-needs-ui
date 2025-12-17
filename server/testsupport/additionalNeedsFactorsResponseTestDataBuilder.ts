import type {
  AdditionalNeedsFactorsResponse,
  ChallengeResponse,
  ConditionResponse,
  StrengthResponse,
  SupportStrategyResponse,
} from 'supportAdditionalNeedsApiClient'
import { aValidConditionResponse } from './conditionResponseTestDataBuilder'
import { aValidChallengeResponse } from './challengeResponseTestDataBuilder'
import { aValidStrengthResponse } from './strengthResponseTestDataBuilder'
import { aValidSupportStrategyResponse } from './supportStrategyResponseTestDataBuilder'

const anAdditionalNeedsFactorsResponse = (options?: {
  conditions?: Array<ConditionResponse>
  challenges?: Array<ChallengeResponse>
  strengths?: Array<StrengthResponse>
  supportStrategies?: Array<SupportStrategyResponse>
}): AdditionalNeedsFactorsResponse => ({
  conditions: options?.conditions || [aValidConditionResponse()],
  challenges: options?.challenges || [aValidChallengeResponse()],
  strengths: options?.strengths || [aValidStrengthResponse()],
  supportStrategies: options?.supportStrategies || [aValidSupportStrategyResponse()],
})

export default anAdditionalNeedsFactorsResponse
