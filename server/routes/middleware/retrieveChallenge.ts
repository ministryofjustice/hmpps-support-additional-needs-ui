import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ChallengeService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve a prisoner's challenge by its reference
 */
const retrieveChallenge = (challengeService: ChallengeService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber, challengeReference } = req.params
    const { username } = req.user

    const { apiErrorCallback } = res.locals
    res.locals.challenge = await Result.wrap(
      challengeService.getChallenge(username, prisonNumber, challengeReference),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveChallenge
