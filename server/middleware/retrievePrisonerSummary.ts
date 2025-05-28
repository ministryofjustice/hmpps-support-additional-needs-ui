import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { PrisonerService } from '../services'

/**
 *  Function that returns a middleware Request handler function to look up the prisoner from PrisonerService and store on res.locals
 */
const retrievePrisonerSummary = (prisonerService: PrisonerService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Lookup the prisoner and store on res.locals
      res.locals.prisonerSummary = await prisonerService.getPrisonerByPrisonNumber(prisonNumber, req.user.username)
      next()
    } catch (error) {
      next(createError(error.status, `Prisoner ${prisonNumber} not returned by the Prisoner Service`))
    }
  }
}
export default retrievePrisonerSummary
