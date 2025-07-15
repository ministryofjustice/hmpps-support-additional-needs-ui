import { NextFunction, Request, Response } from 'express'
import logger from '../../../../../logger'

/**
 * Middleware function to check that the [StrengthDto] exists in the journeyData.
 */
const checkStrengthDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData?.strengthDto) {
    logger.warn(
      `No StrengthDto in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Profile Overview page.`,
    )
    return res.redirect(`/profile/${req.params.prisonNumber}/overview`)
  }
  return next()
}

export default checkStrengthDtoExistsInJourneyData
