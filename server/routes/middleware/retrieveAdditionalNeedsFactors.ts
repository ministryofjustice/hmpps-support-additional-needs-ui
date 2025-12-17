import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AdditionalNeedsService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Additional Needs Factors
 */
const retrieveAdditionalNeedsFactors = (additionalNeedsService: AdditionalNeedsService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Additional Needs Factors and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.additionalNeedsFactors = await Result.wrap(
      additionalNeedsService.getAdditionalNeedFactors(username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveAdditionalNeedsFactors
