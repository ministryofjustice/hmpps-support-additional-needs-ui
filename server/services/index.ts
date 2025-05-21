import { dataAccess } from '../data'
import AuditService from './auditService'
import JourneyDataService from './journeyDataService'
import PrisonService from './prisonService'
import UserService from './userService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    journeyDataStore,
    prisonRegisterClient,
    prisonRegisterStore,
    managedUsersApiClient,
    userCaseLoadDetailStore,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    journeyDataService: new JourneyDataService(journeyDataStore),
    prisonService: new PrisonService(prisonRegisterStore, prisonRegisterClient),
    userService: new UserService(managedUsersApiClient, userCaseLoadDetailStore),
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, JourneyDataService, PrisonService, UserService }
