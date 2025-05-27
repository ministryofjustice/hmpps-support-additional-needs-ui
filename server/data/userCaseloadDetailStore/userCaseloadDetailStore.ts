import type { UserCaseloadDetail } from 'manageUsersApiClient'

export default interface UserCaseloadDetailStore {
  setUserCaseloadDetail(userCaseloadDetail: UserCaseloadDetail, durationHours: number): Promise<string>

  getUserCaseloadDetail(username: string): Promise<UserCaseloadDetail>
}
