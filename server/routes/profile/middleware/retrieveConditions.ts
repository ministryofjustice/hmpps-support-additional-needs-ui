import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ConditionService, PrisonService } from '../../../services'
import { Result } from '../../../utils/result/result'
import mapPrisonNamesToReferencedAndAuditable from '../../../data/mappers/mapPrisonNamesToReferencedAndAuditable'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Conditions
 */
const retrieveConditions = (conditionService: ConditionService, prisonService: PrisonService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Conditions and store in res.locals
    const { apiErrorCallback } = res.locals

    const retrieveConditionsPromise = new Promise((resolve, reject) => {
      conditionService
        .getConditions(username, prisonNumber)
        .then(conditionsList => {
          prisonService.getAllPrisonNamesById(username).then(prisonNamesById =>
            resolve({
              ...conditionsList,
              conditions: conditionsList.conditions.map(condition =>
                mapPrisonNamesToReferencedAndAuditable(condition, prisonNamesById),
              ),
            }),
          )
        })
        .catch(err => reject(err))
    })

    res.locals.conditions = await Result.wrap(retrieveConditionsPromise, apiErrorCallback)

    return next()
  }
}

export default retrieveConditions
