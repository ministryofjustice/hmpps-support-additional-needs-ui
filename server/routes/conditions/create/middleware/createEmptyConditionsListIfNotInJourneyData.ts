import { NextFunction, Request, Response } from 'express'
import type { ConditionsList } from 'dto'

/**
 * Middleware function to check whether a [ConditionsList] exists in the journeyData for the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [ConditionsList] for the prisoner.
 */
const createEmptyConditionsListIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  // Either no ConditionsList in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.conditionsList?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      conditionsList: {
        prisonNumber,
        conditions: [],
      } as ConditionsList,
    }
  }

  next()
}

export default createEmptyConditionsListIfNotInJourneyData
