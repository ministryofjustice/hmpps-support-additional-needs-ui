import stubPing from '../common'
import referenceDataEndpoints from './referenceDataEndpoints'
import searchEndpoints from './searchEndpoints'
import challengesEndpoints from './challengesEndpoints'
import strengthsEndpoints from './strengthsEndpoints'
import conditionsEndpoints from './conditionsEndpoints'
import educationSupportPlanEndpoints from './educationSupportPlanEndpoints'
import educationSupportPlanCreationScheduleEndpoints from './educationSupportPlanCreationScheduleEndpoints'
import additionalLearningNeedsScreenerEndpoints from './additionalLearningNeedsScreenerEndpoints'

export default {
  stubSupportAdditionalNeedsApiPing: stubPing('support-additional-needs-api'),
  ...referenceDataEndpoints,
  ...searchEndpoints,
  ...challengesEndpoints,
  ...strengthsEndpoints,
  ...conditionsEndpoints,
  ...educationSupportPlanEndpoints,
  ...educationSupportPlanCreationScheduleEndpoints,
  ...additionalLearningNeedsScreenerEndpoints,
}
