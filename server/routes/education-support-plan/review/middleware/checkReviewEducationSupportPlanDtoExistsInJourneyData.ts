import { NextFunction, Request, Response } from 'express'
import logger from '../../../../../logger'

/**
 * Request handler function to check the [ReviewEducationSupportPlanDto] exists in the journeyData.
 */
const checkReviewEducationSupportPlanDtoExistsInJourneyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.journeyData?.reviewEducationSupportPlanDto) {
    logger.warn(
      `No ReviewEducationSupportPlanDto in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Profile Overview page.`,
    )
    return res.redirect(`/profile/${req.params.prisonNumber}/overview`)
  }
  return next()
}

export default checkReviewEducationSupportPlanDtoExistsInJourneyData
