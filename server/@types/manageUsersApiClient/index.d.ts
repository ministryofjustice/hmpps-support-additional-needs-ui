declare module 'manageUsersApiClient' {
  import { components } from '../manageUsersApi'

  export type UserCaseloadDetail = components['schemas']['UserCaseloadDetail']
  export type PrisonCaseload = components['schemas']['PrisonCaseload']
}
