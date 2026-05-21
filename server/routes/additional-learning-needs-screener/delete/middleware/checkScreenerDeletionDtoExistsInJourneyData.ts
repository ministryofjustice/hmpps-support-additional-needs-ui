import { NextFunction, Request, Response } from 'express'
import logger from '../../../../../logger'

/**
 * Middleware that checks the [ScreenerDeletionDto] exists in the journeyData before allowing
 * the user to render or submit a step in the screener deletion journey. If it doesn't (e.g.
 * the user deep-linked, or journey data has expired) redirect them back to the profile overview.
 */
const checkScreenerDeletionDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData?.screenerDeletionDto) {
    logger.warn(
      `No ScreenerDeletionDto in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Profile Overview page.`,
    )
    return res.redirect(`/profile/${req.params.prisonNumber}/overview`)
  }
  return next()
}

export default checkScreenerDeletionDtoExistsInJourneyData
