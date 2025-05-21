/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import { createRedisClient } from './redisClient'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import logger from '../../logger'
import JourneyDataStore from './journeyDataStore/journeyDataStore'
import PrisonRegisterStore from './prisonRegisterStore/prisonRegisterStore'
import PrisonRegisterClient from './prisonRegisterClient'
import ManageUsersApiClient from './manageUsersApiClient'
import UserCaseloadDetailStore from './userCaseloadDetailStore/userCaseloadDetailStore'
import SupportAdditionalNeedsApiClient from './supportAdditionalNeedsApiClient'

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    hmppsAuthClient,
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    journeyDataStore: new JourneyDataStore(createRedisClient('journeyData:')),
    prisonRegisterClient: new PrisonRegisterClient(hmppsAuthClient),
    prisonRegisterStore: new PrisonRegisterStore(createRedisClient('prisonRegister:')),
    managedUsersApiClient: new ManageUsersApiClient(hmppsAuthClient),
    userCaseLoadDetailStore: new UserCaseloadDetailStore(createRedisClient('userCaseloadDetail:')),
    supportAdditionalNeedsApiClient: new SupportAdditionalNeedsApiClient(hmppsAuthClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export {
  AuthenticationClient,
  HmppsAuditClient,
  JourneyDataStore,
  ManageUsersApiClient,
  PrisonRegisterClient,
  PrisonRegisterStore,
  SupportAdditionalNeedsApiClient,
  UserCaseloadDetailStore,
}
