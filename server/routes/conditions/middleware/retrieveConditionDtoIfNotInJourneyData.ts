import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { ConditionService } from '../../../services'

/**
 * Middleware function to check whether a [ConditionDto] exists in the journeyData for the prisoner and condition reference in the request URL.
 * If it does not exist for the prisoner and condition reference, retrieve it, replacing any previous version in journeyData.
 */
const retrieveConditionDtoIfNotInJourneyData = (conditionService: ConditionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber, conditionReference } = req.params
    const { username } = req.user

    const { conditionDto } = req.journeyData
    if (conditionDto?.prisonNumber !== prisonNumber || conditionDto?.reference !== conditionReference) {
      try {
        req.journeyData.conditionDto = await conditionService.getCondition(username, prisonNumber, conditionReference)
        if (!req.journeyData.conditionDto) {
          return next(
            createError(404, `Condition not found for prisoner ${prisonNumber} and reference ${conditionReference}`),
          )
        }
      } catch {
        req.flash('pageHasApiErrors', 'true')
        return res.redirect(`/profile/${prisonNumber}/conditions`)
      }
    }

    return next()
  }
}

export default retrieveConditionDtoIfNotInJourneyData
