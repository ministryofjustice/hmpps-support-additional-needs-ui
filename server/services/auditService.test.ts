import AuditService, { Page } from './auditService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  const hmppsAuditClient = new HmppsAuditClient(null) as jest.Mocked<HmppsAuditClient>
  const auditService = new AuditService(hmppsAuditClient)

  const expectedHmppsAuditClientToThrowOnError = false
  const expectedSqsMessageResponse = { $metadata: {}, MessageId: '2fd4aebb-b20d-4e20-aac8-16d3c06c2464' }

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuditClient.sendMessage.mockResolvedValue(expectedSqsMessageResponse)
  })

  describe('logPageViewAttempt', () => {
    it('should send page view event audit message', async () => {
      // Given

      // When
      const actual = await auditService.logPageViewAttempt(Page.SEARCH, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_ATTEMPT_SEARCH',
          who: 'user1',
          subjectId: 'subject123',
          subjectType: 'exampleType',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logPageView', () => {
    it('should send page view event audit message', async () => {
      // Given

      // When
      const actual = await auditService.logPageView(Page.SEARCH, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_SEARCH',
          who: 'user1',
          subjectId: 'subject123',
          subjectType: 'exampleType',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })
})
