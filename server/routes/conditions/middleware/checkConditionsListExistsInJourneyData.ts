import { NextFunction, Request, Response } from 'express'
import logger from '../../../../logger'

/**
 * Middleware function to check that the [ConditionsList] exists in the journeyData.
 */
const checkConditionsListExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData?.conditionsList) {
    logger.warn(
      `No conditionsList in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Profile Overview page.`,
    )
    return res.redirect(`/profile/${req.params.prisonNumber}/overview`)
  }
  return next()
}

export default checkConditionsListExistsInJourneyData
