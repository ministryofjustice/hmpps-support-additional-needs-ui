import stubPing from '../common'
import referenceDataEndpoints from './referenceDataEndpoints'
import searchEndpoints from './searchEndpoints'
import challengesEndpoints from './challengesEndpoints'
import strengthsEndpoints from './strengthsEndpoints'
import conditionsEndpoints from './conditionsEndpoints'
import supportStrategiesEndpoints from './supportStrategiesEndpoints'
import educationSupportPlanEndpoints from './educationSupportPlanEndpoints'
import educationSupportPlanCreationScheduleEndpoints from './educationSupportPlanCreationScheduleEndpoints'
import additionalLearningNeedsScreenerEndpoints from './additionalLearningNeedsScreenerEndpoints'
import planActionStatusEndpoints from './planActionStatusEndpoints'
import educationSupportPlanReviewEndpoints from './educationSupportPlanReviewEndpoints'
import ehcpStatusEndpoints from './ehcpStatusEndpoints'

export default {
  stubSupportAdditionalNeedsApiPing: stubPing('support-additional-needs-api'),
  ...referenceDataEndpoints,
  ...searchEndpoints,
  ...challengesEndpoints,
  ...strengthsEndpoints,
  ...conditionsEndpoints,
  ...supportStrategiesEndpoints,
  ...educationSupportPlanEndpoints,
  ...educationSupportPlanCreationScheduleEndpoints,
  ...educationSupportPlanReviewEndpoints,
  ...additionalLearningNeedsScreenerEndpoints,
  ...planActionStatusEndpoints,
  ...ehcpStatusEndpoints,
}
