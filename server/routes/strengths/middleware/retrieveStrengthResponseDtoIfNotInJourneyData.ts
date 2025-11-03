import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { StrengthResponseDto } from 'dto'
import { StrengthService } from '../../../services'

/**
 * Middleware function to check whether a [StrengthResponseDto] exists in the journeyData for the prisoner and strength reference in the request URL.
 * If it does not exist for the prisoner and strength reference, retrieve it, replacing any previous version in journeyData.
 */
const retrieveStrengthResponseDtoIfNotInJourneyData = (strengthService: StrengthService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber, strengthReference } = req.params
    const { username } = req.user

    const strengthResponseDto = req.journeyData?.strengthDto as StrengthResponseDto
    if (strengthResponseDto?.prisonNumber !== prisonNumber || strengthResponseDto?.reference !== strengthReference) {
      try {
        req.journeyData.strengthDto = await strengthService.getStrength(username, prisonNumber, strengthReference)
        if (!req.journeyData.strengthDto) {
          return next(
            createError(404, `Strength not found for prisoner ${prisonNumber} and reference ${strengthReference}`),
          )
        }
      } catch {
        req.flash('pageHasApiErrors', 'true')
        return res.redirect(`/profile/${prisonNumber}/strengths`)
      }
    }

    return next()
  }
}

export default retrieveStrengthResponseDtoIfNotInJourneyData
