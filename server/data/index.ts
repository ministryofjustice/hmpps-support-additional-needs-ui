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
import PrisonerSearchClient from './prisonerSearchClient'
import RedisPrisonerSearchStore from './prisonerSearchStore/redisPrisonerSearchStore'
import InMemoryPrisonerSearchStore from './prisonerSearchStore/inMemoryPrisonerSearchStore'
import CuriousApiClient from './curiousApiClient'
import ReferenceDataStore from './referenceDataStore/referenceDataStore'
import InMemoryReferenceDataStore from './referenceDataStore/inMemoryReferenceDataStore'
import RedisReferenceDataStore from './referenceDataStore/redisReferenceDataStore'

export const dataAccess = () => {
  const systemTokenStore = config.redis.enabled
    ? new RedisTokenStore(createRedisClient(), 'systemToken:')
    : new InMemoryTokenStore()
  const hmppsAuthClient = new AuthenticationClient(config.apis.hmppsAuth, logger, systemTokenStore)

  const curiousTokenStore = config.redis.enabled
    ? new RedisTokenStore(createRedisClient(), 'curiousToken:')
    : new InMemoryTokenStore()
  const curiousApiAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      systemClientId: config.apis.hmppsAuth.curiousClientId,
      systemClientSecret: config.apis.hmppsAuth.curiousClientSecret,
    },
    logger,
    curiousTokenStore,
  )

  return {
    applicationInfo,
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    journeyDataStore: config.redis.enabled
      ? new RedisJourneyDataStore(createRedisClient())
      : new InMemoryJourneyDataStore(),
    prisonRegisterClient: new PrisonRegisterClient(hmppsAuthClient),
    prisonRegisterStore: config.redis.enabled
      ? new RedisPrisonRegisterStore(createRedisClient())
      : new InMemoryPrisonRegisterStore(),
    prisonerSearchClient: new PrisonerSearchClient(hmppsAuthClient),
    prisonerSearchStore: config.redis.enabled
      ? new RedisPrisonerSearchStore(createRedisClient())
      : new InMemoryPrisonerSearchStore(),
    managedUsersApiClient: new ManageUsersApiClient(hmppsAuthClient),
    supportAdditionalNeedsApiClient: new SupportAdditionalNeedsApiClient(hmppsAuthClient),
    curiousApiClient: new CuriousApiClient(curiousApiAuthClient),
    referenceDataStore: config.redis.enabled
      ? new RedisReferenceDataStore(createRedisClient())
      : new InMemoryReferenceDataStore(),
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
  PrisonerSearchClient,
  type RedisPrisonRegisterStore,
  SupportAdditionalNeedsApiClient,
  CuriousApiClient,
  type ReferenceDataStore,
}
