import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asUser, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { UserCaseloadDetail } from 'manageUsersApiClient'
import logger from '../../logger'
import config from '../config'

export default class ManageUsersApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Manage Users API Client', config.apis.manageUsersApi, logger, authenticationClient)
  }

  async getUserCaseLoads(token: string): Promise<UserCaseloadDetail> {
    logger.info('Getting user caseloads: calling HMPPS Manage Users API')
    return this.get<UserCaseloadDetail>(
      {
        path: '/users/me/caseloads',
      },
      asUser(token),
    )
  }
}
