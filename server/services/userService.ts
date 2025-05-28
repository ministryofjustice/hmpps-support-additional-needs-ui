import type { UserCaseloadDetail } from 'manageUsersApiClient'
import { ManageUsersApiClient } from '../data'
import logger from '../../logger'

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUserCaseLoads(userToken: string): Promise<UserCaseloadDetail> {
    try {
      return await this.manageUsersApiClient.getUserCaseLoads(userToken)
    } catch (e) {
      logger.error(`Error retrieving user caseload detail`, e)
      return undefined
    }
  }
}
