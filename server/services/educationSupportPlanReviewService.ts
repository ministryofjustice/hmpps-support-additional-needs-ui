import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import logger from '../../logger'
import { toSupportPlanReviewRequest } from '../data/mappers/supportPlanReviewRequestMapper'

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
}
