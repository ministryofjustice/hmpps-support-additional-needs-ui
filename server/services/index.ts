import { dataAccess } from '../data'
import AuditService from './auditService'
import JourneyDataService from './journeyDataService'
import PrisonService from './prisonService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, journeyDataStore, prisonRegisterClient, prisonRegisterStore } =
    dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    journeyDataService: new JourneyDataService(journeyDataStore),
    prisonService: new PrisonService(prisonRegisterStore, prisonRegisterClient),
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, JourneyDataService, PrisonService }
