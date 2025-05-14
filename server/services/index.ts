import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleService from './exampleService'
import JourneyDataService from './journeyDataService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient, journeyDataStore } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    journeyDataService: new JourneyDataService(journeyDataStore),
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, ExampleService, JourneyDataService }
