import { startOfDay } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import EducationSupportPlanReviewService from './educationSupportPlanReviewService'
import aValidReviewEducationSupportPlanDto from '../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import aValidEducationSupportPlanDto from '../testsupport/educationSupportPlanDtoTestDataBuilder'
import {
  anUpdateEducationSupportPlanRequest,
  aSupportPlanReviewRequest,
} from '../testsupport/supportPlanReviewRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('educationSupportPlanReviewService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new EducationSupportPlanReviewService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('recordEducationSupportPlanReview', () => {
    it('should record an education support plan review', async () => {
      supportAdditionalNeedsApiClient.reviewEducationSupportPlan.mockResolvedValue(null)

      const reviewEducationSupportPlanDto = aValidReviewEducationSupportPlanDto({
        planReviewedByOther: null,
        otherPeopleConsulted: null,
        reviewDate: startOfDay('2026-02-13'),
      })
      const educationSupportPlanDto = aValidEducationSupportPlanDto()

      const expectedSupportPlanReviewRequest = aSupportPlanReviewRequest({
        reviewCreatedBy: null,
        otherContributors: null,
        prisonerFeedback: 'Chris is happy with his progress',
        reviewerFeedback: 'Chris has made incredible progress',
        nextReviewDate: startOfDay('2026-02-13'),
        updateEducationSupportPlan: anUpdateEducationSupportPlanRequest({
          teachingAdjustments: null,
          specificTeachingSkills: null,
          examAccessArrangements: null,
          lnspSupport: null,
          lnspSupportHours: null,
          detail: null,
        }),
      })

      // When
      await service.recordEducationSupportPlanReview(username, reviewEducationSupportPlanDto, educationSupportPlanDto)

      // Then
      expect(supportAdditionalNeedsApiClient.reviewEducationSupportPlan).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedSupportPlanReviewRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.reviewEducationSupportPlan.mockRejectedValue(expectedError)

      const reviewEducationSupportPlanDto = aValidReviewEducationSupportPlanDto({
        planReviewedByOther: null,
        otherPeopleConsulted: null,
        reviewDate: startOfDay('2026-02-13'),
      })
      const educationSupportPlanDto = aValidEducationSupportPlanDto()

      const expectedSupportPlanReviewRequest = aSupportPlanReviewRequest({
        reviewCreatedBy: null,
        otherContributors: null,
        prisonerFeedback: 'Chris is happy with his progress',
        reviewerFeedback: 'Chris has made incredible progress',
        nextReviewDate: startOfDay('2026-02-13'),
        updateEducationSupportPlan: anUpdateEducationSupportPlanRequest({
          teachingAdjustments: null,
          specificTeachingSkills: null,
          examAccessArrangements: null,
          lnspSupport: null,
          lnspSupportHours: null,
          detail: null,
        }),
      })

      // When
      const actual = await service
        .recordEducationSupportPlanReview(username, reviewEducationSupportPlanDto, educationSupportPlanDto)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.reviewEducationSupportPlan).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedSupportPlanReviewRequest,
      )
    })
  })
})
