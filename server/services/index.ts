import { dataAccess } from '../data'
import AuditService from './auditService'
import JourneyDataService from './journeyDataService'
import PrisonerService from './prisonerService'
import PrisonService from './prisonService'
import UserService from './userService'
import SearchService from './searchService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    journeyDataStore,
    prisonerSearchClient,
    prisonerSearchStore,
    prisonRegisterClient,
    prisonRegisterStore,
    managedUsersApiClient,
    supportAdditionalNeedsApiClient,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    journeyDataService: new JourneyDataService(journeyDataStore),
    prisonerService: new PrisonerService(prisonerSearchStore, prisonerSearchClient),
    prisonService: new PrisonService(prisonRegisterStore, prisonRegisterClient),
    userService: new UserService(managedUsersApiClient),
    searchService: new SearchService(supportAdditionalNeedsApiClient),
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, JourneyDataService, PrisonerService, PrisonService, SearchService, UserService }
