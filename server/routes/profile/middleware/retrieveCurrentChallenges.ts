import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ChallengeService } from '../../../services'
import { Result } from '../../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's current challenges
 */
const retrieveCurrentChallenges = (challengeService: ChallengeService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { apiErrorCallback } = res.locals
    res.locals.challenges = (
      await Result.wrap(challengeService.getChallenges(req.user.username, prisonNumber), apiErrorCallback)
    ).getOrNull()
    return next()
  }
}

export default retrieveCurrentChallenges
