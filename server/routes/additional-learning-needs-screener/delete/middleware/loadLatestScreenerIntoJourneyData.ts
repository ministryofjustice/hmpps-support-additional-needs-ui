import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { AlnScreenerResponseDto, ScreenerDeletionDto } from 'dto'
import { AdditionalLearningNeedsScreenerService } from '../../../../services'
import dateComparator from '../../../dateComparator'

/**
 * Middleware that loads the prisoner's latest ALN Screener into journeyData if it isn't already
 * present (or if it's stale relative to the prison number in the URL). Used by the screener
 * deletion journey so that subsequent steps can read the screener payload without re-hitting the
 * API and so the audit method can stamp the deleted screener's reference + date.
 *
 * 404s if the prisoner has no ALN Screener at all.
 */
const loadLatestScreenerIntoJourneyData = (
  alnScreenerService: AdditionalLearningNeedsScreenerService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    const existing = req.journeyData?.screenerDeletionDto as ScreenerDeletionDto
    if (existing?.prisonNumber === prisonNumber && existing?.latestScreener) {
      return next()
    }

    try {
      const screenerList = await alnScreenerService.getAlnScreeners(username, prisonNumber)
      const latestScreener = (screenerList?.screeners ?? [])
        .slice()
        .sort((left: AlnScreenerResponseDto, right: AlnScreenerResponseDto) =>
          dateComparator(left.screenerDate, right.screenerDate, 'DESC'),
        )[0]

      if (!latestScreener) {
        return next(createError(404, `No current ALN Screener found for prisoner ${prisonNumber}`))
      }

      req.journeyData.screenerDeletionDto = {
        prisonNumber,
        latestScreener,
      }
    } catch {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect(`/profile/${prisonNumber}/overview`)
    }

    return next()
  }
}

export default loadLatestScreenerIntoJourneyData
