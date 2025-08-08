import { NextFunction, Request, RequestHandler, Response } from 'express'
import { PrisonService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve all prison names by ID
 */
const retrievePrisonsLookup = (prisonService: PrisonService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.user

    // Lookup the prison names by ID and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.prisonNamesById = await Result.wrap(prisonService.getAllPrisonNamesById(username), apiErrorCallback)

    return next()
  }
}

export default retrievePrisonsLookup
