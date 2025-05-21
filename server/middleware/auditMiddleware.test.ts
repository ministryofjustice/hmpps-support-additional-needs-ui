import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import PrisonService from '../services/prisonService'
import JourneyDataService from '../services/journeyDataService'
import SearchService from '../services/searchService'

jest.mock('../services/auditService')
jest.mock('../services/prisonService')
jest.mock('../services/journeyDataService')
jest.mock('../services/searchService')

let app: Express
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
const journeyDataService = new JourneyDataService(null) as jest.Mocked<JourneyDataService>
const searchService = new SearchService(null) as jest.Mocked<SearchService>

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      prisonService,
      journeyDataService,
      searchService,
    },
  })

  jest.resetAllMocks()

  prisonService.getAllPrisonNamesById.mockResolvedValue(new Map([['BXI', 'Brixton (HMP)']]))
})

describe('auditMiddleware', () => {
  it('should raise page view audit events', async () => {
    // Given

    // When
    const response = await request(app).get('/search')

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.SEARCH, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
  })

  it('should raise page view audit events with query parameters', async () => {
    // Given

    // When
    const response = await request(app).get('/search').query({ searchTerm: 'search term' })

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.SEARCH, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {
          searchTerm: 'search term',
        },
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {
          searchTerm: 'search term',
        },
      },
    })
  })
})
