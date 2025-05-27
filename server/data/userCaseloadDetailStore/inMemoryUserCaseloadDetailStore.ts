import type { UserCaseloadDetail } from 'manageUsersApiClient'
import UserCaseloadDetailStore from './userCaseloadDetailStore'

export default class InMemoryUserCaseloadDetailStore implements UserCaseloadDetailStore {
  private data: Map<string, UserCaseloadDetail> = new Map()

  async setUserCaseloadDetail(userCaseloadDetail: UserCaseloadDetail, _durationHours: number): Promise<string> {
    this.data.set(`userCaseloadDetail.${userCaseloadDetail.username}`, userCaseloadDetail)
    return Promise.resolve('OK')
  }

  async getUserCaseloadDetail(username: string): Promise<UserCaseloadDetail> {
    return Promise.resolve(this.data.get(`userCaseloadDetail.${username}`))
  }
}
