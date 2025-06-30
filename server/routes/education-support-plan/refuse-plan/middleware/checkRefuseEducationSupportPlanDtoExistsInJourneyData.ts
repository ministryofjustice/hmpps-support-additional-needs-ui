import { NextFunction, Request, Response } from 'express'
import logger from '../../../../../logger'

/**
 * Request handler function to check the [RefuseEducationSupportPlanDto] exists in the journeyData.
 */
const checkRefuseEducationSupportPlanDtoExistsInJourneyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.journeyData?.refuseEducationSupportPlanDto) {
    logger.warn(
      `No RefuseEducationSupportPlanDto in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Profile Overview page.`,
    )
    return res.redirect(`/profile/${req.params.prisonNumber}/overview`)
  }
  return next()
}

export default checkRefuseEducationSupportPlanDtoExistsInJourneyData
