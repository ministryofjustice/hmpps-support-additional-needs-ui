import type { UserCaseloadDetail } from 'manageUsersApiClient'
import { ManageUsersApiClient, UserCaseloadDetailStore } from '../data'
import logger from '../../logger'

const USER_CASELOAD_DETAIL_CACHE_TTL_HOURS = 1

export default class UserService {
  constructor(
    private readonly manageUsersApiClient: ManageUsersApiClient,
    private readonly userCaseloadDetailStore: UserCaseloadDetailStore,
  ) {}

  async getUserCaseLoads(username: string, userToken: string): Promise<UserCaseloadDetail> {
    try {
      return (
        (await this.getCacheUserCaseloadDetail(username)) || (await this.retrieveAndCacheUserCaseloadDetail(userToken))
      )
    } catch (e) {
      logger.error(`Error retrieving user caseload detail`, e)
      return undefined
    }
  }

  private async getCacheUserCaseloadDetail(username: string): Promise<UserCaseloadDetail> {
    try {
      const userCaseloadDetail = await this.userCaseloadDetailStore.getUserCaseloadDetail(username)
      if (!userCaseloadDetail) {
        logger.debug(`User caseload detail not found in cache`)
      }
      return userCaseloadDetail
    } catch (ex) {
      // Looking up the user caseload detail from the cached data store failed for some reason. Return undefined.
      logger.error('Error retrieving cached user caseload detail', ex)
    }
    return undefined
  }

  /**
   * Calls the manage-users API to retrieve the caseload detail for the user, then caches it in the cache.
   * Returns the user caseload detail.
   */
  private async retrieveAndCacheUserCaseloadDetail(userToken: string): Promise<UserCaseloadDetail> {
    logger.info('Retrieving and caching user caseload detail')
    let userCaseloadDetail: UserCaseloadDetail
    try {
      userCaseloadDetail = (await this.manageUsersApiClient.getUserCaseLoads(userToken)) || []
    } catch (ex) {
      // Retrieving user caseload detail from the API failed
      logger.error('Error retrieving prisons', ex)
      throw ex
    }

    try {
      await this.userCaseloadDetailStore.setUserCaseloadDetail(userCaseloadDetail, USER_CASELOAD_DETAIL_CACHE_TTL_HOURS)
    } catch (ex) {
      // Caching user caseload detail retrieved from the API failed. Log a warning but return the user caseload detail anyway. Next time the service is called the caching will be retried.
      logger.warn('Error caching user caseload detail', ex)
    }
    return userCaseloadDetail
  }
}
