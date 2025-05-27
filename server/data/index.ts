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
import PrisonRegisterClient from './prisonRegisterClient'
import ManageUsersApiClient from './manageUsersApiClient'
import SupportAdditionalNeedsApiClient from './supportAdditionalNeedsApiClient'
import JourneyDataStore from './journeyDataStore/journeyDataStore'
import InMemoryJourneyDataStore from './journeyDataStore/inMemoryJourneyDataStore'
import RedisJourneyDataStore from './journeyDataStore/redisJourneyDataStore'
import PrisonRegisterStore from './prisonRegisterStore/prisonRegisterStore'
import InMemoryPrisonRegisterStore from './prisonRegisterStore/inMemoryPrisonRegisterStore'
import RedisPrisonRegisterStore from './prisonRegisterStore/redisPrisonRegisterStore'
import UserCaseloadDetailStore from './userCaseloadDetailStore/userCaseloadDetailStore'
import InMemoryUserCaseloadDetailStore from './userCaseloadDetailStore/inMemoryUserCaseloadDetailStore'
import RedisUserCaseloadDetailStore from './userCaseloadDetailStore/redisUserCaseloadDetailStore'

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
    journeyDataStore: config.redis.enabled
      ? new RedisJourneyDataStore(createRedisClient('journeyData:'))
      : new InMemoryJourneyDataStore(),
    prisonRegisterClient: new PrisonRegisterClient(hmppsAuthClient),
    prisonRegisterStore: config.redis.enabled
      ? new RedisPrisonRegisterStore(createRedisClient('prisonRegister:'))
      : new InMemoryPrisonRegisterStore(),
    managedUsersApiClient: new ManageUsersApiClient(hmppsAuthClient),
    userCaseLoadDetailStore: config.redis.enabled
      ? new RedisUserCaseloadDetailStore(createRedisClient('userCaseloadDetail:'))
      : new InMemoryUserCaseloadDetailStore(),
    supportAdditionalNeedsApiClient: new SupportAdditionalNeedsApiClient(hmppsAuthClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export {
  AuthenticationClient,
  HmppsAuditClient,
  type JourneyDataStore,
  ManageUsersApiClient,
  PrisonRegisterClient,
  type PrisonRegisterStore,
  SupportAdditionalNeedsApiClient,
  type UserCaseloadDetailStore,
}
