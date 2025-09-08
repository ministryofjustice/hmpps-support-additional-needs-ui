import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AdditionalLearningNeedsScreenerService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's ALN Screeners
 */
const retrieveAlnScreeners = (alnService: AdditionalLearningNeedsScreenerService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's ALN Screeners and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.alnScreeners = await Result.wrap(alnService.getAlnScreeners(username, prisonNumber), apiErrorCallback)

    return next()
  }
}

export default retrieveAlnScreeners
