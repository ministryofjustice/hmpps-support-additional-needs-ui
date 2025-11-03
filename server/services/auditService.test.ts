import AuditService, { BaseAuditData, Page } from './auditService'
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

  describe('logCreateEducationLearnerSupportPlan', () => {
    it('should send ELSP Creation event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logCreateEducationLearnerSupportPlan(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'CREATE_EDUCATION_LEARNER_SUPPORT_PLAN',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logReviewEducationLearnerSupportPlan', () => {
    it('should send ELSP Review event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logReviewEducationLearnerSupportPlan(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'REVIEW_EDUCATION_LEARNER_SUPPORT_PLAN',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logRecordAlnScreener', () => {
    it('should send Record ALN Screener event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logRecordAlnScreener(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'RECORD_ALN_SCREENER',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logCreateChallenge', () => {
    it('should send Create Challenge event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logCreateChallenge(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'CREATE_CHALLENGE',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logEditChallenge', () => {
    it('should send Edit Challenge event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { challengeReference: '94429db1-c063-459e-8479-8fe2440dbfbd' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logEditChallenge(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'EDIT_CHALLENGE',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: { challengeReference: '94429db1-c063-459e-8479-8fe2440dbfbd' },
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logCreateStrength', () => {
    it('should send Create Strength event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logCreateStrength(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'CREATE_STRENGTH',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logEditStrength', () => {
    it('should send Edit Strength event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { challengeReference: '94429db1-c063-459e-8479-8fe2440dbfbd' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logEditStrength(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'EDIT_STRENGTH',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: { challengeReference: '94429db1-c063-459e-8479-8fe2440dbfbd' },
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logCreateCondition', () => {
    it('should send Create Condition event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logCreateCondition(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'CREATE_CONDITION',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logCreateSupportStrategy', () => {
    it('should send Create Support Strategy event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logCreateSupportStrategy(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'CREATE_SUPPORT_STRATEGY',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logUpdateEducationLearnerSupportPlanAsRefused', () => {
    it('should send Update ELSP As Refused event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {},
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logUpdateEducationLearnerSupportPlanAsRefused(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'UPDATE_EDUCATION_LEARNER_SUPPORT_PLAN_SCHEDULE',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {},
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })
})
