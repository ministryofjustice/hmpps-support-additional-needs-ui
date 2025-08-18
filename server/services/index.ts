import { dataAccess } from '../data'
import AuditService from './auditService'
import JourneyDataService from './journeyDataService'
import PrisonerService from './prisonerService'
import PrisonService from './prisonService'
import UserService from './userService'
import SearchService from './searchService'
import CuriousService from './curiousService'
import EducationSupportPlanService from './educationSupportPlanService'
import EducationSupportPlanScheduleService from './educationSupportPlanScheduleService'
import ChallengeService from './challengeService'
import ConditionService from './conditionService'
import ReferenceDataService from './referenceDataService'
import StrengthService from './strengthService'
import SupportStrategyService from './supportStrategyService'
import AdditionalLearningNeedsScreenerService from './additionalLearningNeedsScreenerService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    journeyDataStore,
    prisonerSearchClient,
    prisonerSearchStore,
    prisonRegisterClient,
    prisonRegisterStore,
    managedUsersApiClient,
    supportAdditionalNeedsApiClient,
    curiousApiClient,
    referenceDataStore,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    journeyDataService: new JourneyDataService(journeyDataStore),
    prisonerService: new PrisonerService(prisonerSearchStore, prisonerSearchClient),
    prisonService: new PrisonService(prisonRegisterStore, prisonRegisterClient),
    userService: new UserService(managedUsersApiClient),
    searchService: new SearchService(supportAdditionalNeedsApiClient),
    curiousService: new CuriousService(curiousApiClient),
    educationSupportPlanService: new EducationSupportPlanService(supportAdditionalNeedsApiClient),
    educationSupportPlanScheduleService: new EducationSupportPlanScheduleService(supportAdditionalNeedsApiClient),
    challengeService: new ChallengeService(supportAdditionalNeedsApiClient),
    conditionService: new ConditionService(supportAdditionalNeedsApiClient),
    referenceDataService: new ReferenceDataService(referenceDataStore, supportAdditionalNeedsApiClient),
    strengthService: new StrengthService(supportAdditionalNeedsApiClient),
    supportStrategyService: new SupportStrategyService(supportAdditionalNeedsApiClient),
    additionalLearningNeedsService: new AdditionalLearningNeedsScreenerService(supportAdditionalNeedsApiClient),
  }
}

export type Services = ReturnType<typeof services>

export {
  AdditionalLearningNeedsScreenerService,
  AuditService,
  ChallengeService,
  ConditionService,
  CuriousService,
  EducationSupportPlanService,
  EducationSupportPlanScheduleService,
  JourneyDataService,
  PrisonerService,
  PrisonService,
  ReferenceDataService,
  SearchService,
  StrengthService,
  SupportStrategyService,
  UserService,
}
