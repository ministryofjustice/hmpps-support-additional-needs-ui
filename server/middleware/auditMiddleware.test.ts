import { PrisonerBasePermission } from '@ministryofjustice/hmpps-prison-permissions-lib'
import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import PrisonService from '../services/prisonService'
import JourneyDataService from '../services/journeyDataService'
import SearchService from '../services/searchService'
import PrisonerService from '../services/prisonerService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import { mockPrisonerPermissionsGuard } from '../testutils/mockPermissions'

jest.mock('@ministryofjustice/hmpps-prison-permissions-lib')
jest.mock('../services/auditService')
jest.mock('../services/prisonService')
jest.mock('../services/journeyDataService')
jest.mock('../services/searchService')
jest.mock('../services/prisonerService')

let app: Express
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
const journeyDataService = new JourneyDataService(null) as jest.Mocked<JourneyDataService>
const searchService = new SearchService(null) as jest.Mocked<SearchService>
const prisonerService = new PrisonerService(null, null) as jest.Mocked<PrisonerService>

beforeEach(() => {
  jest.resetAllMocks()

  prisonService.getAllPrisonNamesById.mockResolvedValue({ BXI: 'Brixton (HMP)' })
  mockPrisonerPermissionsGuard([PrisonerBasePermission.read])

  app = appWithAllRoutes({
    services: {
      auditService,
      prisonService,
      journeyDataService,
      searchService,
      prisonerService,
    },
  })
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

  it('should raise page view audit events even when search service returns an error', async () => {
    // Given
    searchService.searchPrisonersInPrison.mockRejectedValue(new Error('Search service unavailable'))

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

  it('should raise a page view audit event for the not found page when a route is not found', async () => {
    // When
    const response = await request(app).get('/unknown')

    // Then
    expect(response.statusCode).toBe(404)
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.NOT_FOUND, {
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

  it('should raise page view audit events with the user subject and path params', async () => {
    // Given
    const prisonNumber = 'A1234AA'
    prisonerService.getPrisonerByPrisonNumber.mockResolvedValue(aValidPrisoner({ prisonNumber }))

    // When
    const response = await request(app).get(`/strengths/${prisonNumber}/create/select-category`).redirects(1)

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.CREATE_STRENGTH_CATEGORY, {
      who: 'user1',
      subjectType: 'PRISONER_ID',
      subjectId: prisonNumber,
      correlationId: expect.any(String),
      details: {
        params: {
          prisonNumber,
          journeyId: expect.any(String),
        },
        query: {},
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.CREATE_STRENGTH_CATEGORY, {
      who: 'user1',
      subjectType: 'PRISONER_ID',
      subjectId: prisonNumber,
      correlationId: expect.any(String),
      details: {
        params: {
          prisonNumber,
          journeyId: expect.any(String),
        },
        query: {},
      },
    })
  })
})
