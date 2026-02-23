import { PermissionsService as PrisonPermissionsService } from '@ministryofjustice/hmpps-prison-permissions-lib'
import { ApplicationInfo, dataAccess } from '../data'
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
import EducationSupportPlanReviewService from './educationSupportPlanReviewService'
import AdditionalNeedsService from './additionalNeedsService'
import logger from '../../logger'
import config from '../config'

export const services = () => {
  const {
    applicationInfo,
    telemetryClient,
    hmppsAuthClient,
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

  const prisonPermissionsService = PrisonPermissionsService.create({
    prisonerSearchConfig: config.apis.prisonerSearch,
    authenticationClient: hmppsAuthClient,
    logger,
    telemetryClient,
  })

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
    educationSupportPlanReviewService: new EducationSupportPlanReviewService(supportAdditionalNeedsApiClient),
    additionalNeedsService: new AdditionalNeedsService(supportAdditionalNeedsApiClient),
    prisonPermissionsService,
  }
}

export type Services = ReturnType<typeof services>

export {
  type ApplicationInfo,
  AuditService,
  JourneyDataService,
  PrisonerService,
  PrisonService,
  UserService,
  SearchService,
  CuriousService,
  EducationSupportPlanService,
  EducationSupportPlanScheduleService,
  ChallengeService,
  ConditionService,
  ReferenceDataService,
  StrengthService,
  SupportStrategyService,
  AdditionalLearningNeedsScreenerService,
  EducationSupportPlanReviewService,
  AdditionalNeedsService,
  PrisonPermissionsService,
}
