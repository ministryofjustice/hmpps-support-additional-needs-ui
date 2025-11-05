import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { SupportStrategyResponseDto } from 'dto'
import { SupportStrategyService } from '../../../services'

/**
 * Middleware function to check whether a [SupportStrategyResponseDto] exists in the journeyData for the prisoner and support strategy reference in the request URL.
 * If it does not exist for the prisoner and support strategy reference, retrieve it, replacing any previous version in journeyData.
 */
const retrieveSupportStrategyResponseDtoIfNotInJourneyData = (
  supportStrategyService: SupportStrategyService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber, supportStrategyReference } = req.params
    const { username } = req.user

    const supportStrategyResponseDto = req.journeyData?.supportStrategyDto as SupportStrategyResponseDto
    if (
      supportStrategyResponseDto?.prisonNumber !== prisonNumber ||
      supportStrategyResponseDto?.reference !== supportStrategyReference
    ) {
      try {
        req.journeyData.supportStrategyDto = await supportStrategyService.getSupportStrategy(
          username,
          prisonNumber,
          supportStrategyReference,
        )
        if (!req.journeyData.supportStrategyDto) {
          return next(
            createError(
              404,
              `Support Strategy not found for prisoner ${prisonNumber} and reference ${supportStrategyReference}`,
            ),
          )
        }
      } catch {
        req.flash('pageHasApiErrors', 'true')
        return res.redirect(`/profile/${prisonNumber}/support-strategies`)
      }
    }

    return next()
  }
}

export default retrieveSupportStrategyResponseDtoIfNotInJourneyData
