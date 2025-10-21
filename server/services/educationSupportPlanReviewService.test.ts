import { startOfDay } from 'date-fns'
import type { ReviewEducationSupportPlanDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import EducationSupportPlanReviewService from './educationSupportPlanReviewService'
import aValidReviewEducationSupportPlanDto from '../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import aValidEducationSupportPlanDto from '../testsupport/educationSupportPlanDtoTestDataBuilder'
import {
  anUpdateEducationSupportPlanRequest,
  aSupportPlanReviewRequest,
} from '../testsupport/supportPlanReviewRequestTestDataBuilder'
import { aPlanReviewsResponse } from '../testsupport/planReviewsResponseTestDataBuilder'

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

  describe('getEducationSupportPlanReviews', () => {
    it('should get education support plan reviews', async () => {
      // Given
      const planReviewsResponse = aPlanReviewsResponse()
      supportAdditionalNeedsApiClient.getEducationSupportPlanReviews.mockResolvedValue(planReviewsResponse)

      const expectedReviewsList = [
        {
          ...aValidReviewEducationSupportPlanDto({
            prisonNumber: 'A1234BC',
            planReviewedByOther: { name: 'Alan Teacher', jobRole: 'Education Instructor' },
            prisonerDeclinedBeingPartOfReview: false,
            prisonerViewOnProgress: 'I feel that I am progressing well',
            reviewersViewOnProgress: 'Chris is attending classes and progressing as expected',
            prisonId: null,
            reviewDate: null,
            reviewExistingNeeds: null,
            additionalInformation: null,
          }),
          teachingAdjustmentsNeeded: null as boolean,
          teachingAdjustments: null as string,
          specificTeachingSkillsNeeded: null as boolean,
          specificTeachingSkills: null as string,
          examArrangementsNeeded: null as boolean,
          examArrangements: null as string,
          lnspSupportNeeded: null as boolean,
          lnspSupport: null as string,
          lnspSupportHours: null as number,
        },
      ]

      // When
      const actual = await service.getEducationSupportPlanReviews(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedReviewsList)
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlanReviews).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })
  })

  it('should return empty ReviewEducationSupportPlanDto given API returns null', async () => {
    // Given
    supportAdditionalNeedsApiClient.getEducationSupportPlanReviews.mockResolvedValue(null)

    const expectedReviewsList: Array<ReviewEducationSupportPlanDto> = []

    // When
    const actual = await service.getEducationSupportPlanReviews(username, prisonNumber)

    // Then
    expect(actual).toEqual(expectedReviewsList)
    expect(supportAdditionalNeedsApiClient.getEducationSupportPlanReviews).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should rethrow error given API client throws error', async () => {
    // Given
    const expectedError = new Error('Internal Server Error')
    supportAdditionalNeedsApiClient.getEducationSupportPlanReviews.mockRejectedValue(expectedError)

    // When
    const actual = await service.getEducationSupportPlanReviews(username, prisonNumber).catch(e => e)

    // Then
    expect(actual).toEqual(expectedError)
    expect(supportAdditionalNeedsApiClient.getEducationSupportPlanReviews).toHaveBeenCalledWith(prisonNumber, username)
  })
})
