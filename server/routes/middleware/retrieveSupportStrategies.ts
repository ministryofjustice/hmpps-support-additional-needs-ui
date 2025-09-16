import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Result } from '../../utils/result/result'
import SupportStrategyService from '../../services/supportStrategyService'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Support Strategies
 */
const retrieveSupportStrategies = (supportStrategyService: SupportStrategyService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Support Strategies and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.supportStrategies = await Result.wrap(
      supportStrategyService.getSupportStrategies(username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSupportStrategies
