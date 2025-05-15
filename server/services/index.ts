import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleService from './exampleService'
import JourneyDataService from './journeyDataService'
import PrisonService from './prisonService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    exampleApiClient,
    journeyDataStore,
    prisonRegisterClient,
    prisonRegisterStore,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    journeyDataService: new JourneyDataService(journeyDataStore),
    prisonService: new PrisonService(prisonRegisterStore, prisonRegisterClient),
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, ExampleService, JourneyDataService, PrisonService }
