import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { ChallengeResponseDto } from 'dto'
import { ChallengeService } from '../../../services'

/**
 * Middleware function to check whether a [ChallengeResponseDto] exists in the journeyData for the prisoner and challenge reference in the request URL.
 * If it does not exist for the prisoner and challenge reference, retrieve it, replacing any previous version in journeyData.
 */
const retrieveChallengeResponseDtoIfNotInJourneyData = (challengeService: ChallengeService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber, challengeReference } = req.params
    const { username } = req.user

    const challengeResponseDto = req.journeyData?.challengeDto as ChallengeResponseDto
    if (challengeResponseDto?.prisonNumber !== prisonNumber || challengeResponseDto?.reference !== challengeReference) {
      try {
        req.journeyData.challengeDto = await challengeService.getChallenge(username, prisonNumber, challengeReference)
        if (!req.journeyData.challengeDto) {
          return next(
            createError(404, `Challenge not found for prisoner ${prisonNumber} and reference ${challengeReference}`),
          )
        }
      } catch {
        req.flash('pageHasApiErrors', 'true')
        return res.redirect(`/profile/${prisonNumber}/challenges`)
      }
    }

    return next()
  }
}

export default retrieveChallengeResponseDtoIfNotInJourneyData
