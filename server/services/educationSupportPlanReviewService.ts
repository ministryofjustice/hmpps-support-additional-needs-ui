import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import logger from '../../logger'
import { toSupportPlanReviewRequest } from '../data/mappers/supportPlanReviewRequestMapper'
import toReviewEducationSupportPlanDtos from '../data/mappers/reviewEducationSupportPlanDtoMapper'

export default class EducationSupportPlanReviewService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async recordEducationSupportPlanReview(
    username: string,
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ): Promise<void> {
    const { prisonNumber } = reviewEducationSupportPlanDto
    try {
      const supportPlanReviewRequest = toSupportPlanReviewRequest(
        reviewEducationSupportPlanDto,
        educationSupportPlanDto,
      )
      await this.supportAdditionalNeedsApiClient.reviewEducationSupportPlan(
        prisonNumber,
        username,
        supportPlanReviewRequest,
      )
    } catch (e) {
      logger.error(`Error recording education support plan review for prisoner [${prisonNumber}]`, e)
      throw e
    }
  }

  async getEducationSupportPlanReviews(
    username: string,
    prisonNumber: string,
  ): Promise<Array<ReviewEducationSupportPlanDto>> {
    try {
      const planReviewsResponse = await this.supportAdditionalNeedsApiClient.getEducationSupportPlanReviews(
        prisonNumber,
        username,
      )
      return toReviewEducationSupportPlanDtos(prisonNumber, planReviewsResponse)
    } catch (e) {
      logger.error(`Error getting education support plan review for prisoner [${prisonNumber}]`, e)
      throw e
    }
  }
}
