import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StrengthService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Strengths
 */
const retrieveStrengths = (strengthService: StrengthService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Strengths and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.strengths = await Result.wrap(strengthService.getStrengths(username, prisonNumber), apiErrorCallback)

    return next()
  }
}

export default retrieveStrengths
