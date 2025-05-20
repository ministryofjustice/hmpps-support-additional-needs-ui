import type { AdditionalNeedsSummary } from 'supportAdditionalNeedsApiClient'

const aValidAdditionalNeedsSummary = (
  options: {
    hasConditions?: boolean
    hasChallenges?: boolean
    hasStrengths?: boolean
    hasSupportRecommendations?: boolean
  } = {
    hasConditions: true,
    hasChallenges: true,
    hasStrengths: true,
    hasSupportRecommendations: true,
  },
): AdditionalNeedsSummary => ({
  ...options,
})

export default aValidAdditionalNeedsSummary
