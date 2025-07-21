import { NextFunction, Request, Response } from 'express'
import { ReferenceDataService } from '../../services'
import ReferenceDataDomain from '../../enums/referenceDataDomain'

/**
 * Function that returns a middleware handler function to retrieve the specified reference data and store on res.locals
 */
const retrieveReferenceData = (
  referenceDataDomain: ReferenceDataDomain,
  referenceDataService: ReferenceDataService,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    switch (referenceDataDomain) {
      case ReferenceDataDomain.CHALLENGE:
        res.locals.challengesReferenceData = await referenceDataService.getChallenges(req.user.username, false)
        break
      case ReferenceDataDomain.STRENGTH:
        res.locals.strengthsReferenceData = await referenceDataService.getStrengths(req.user.username, false)
        break
      case ReferenceDataDomain.CONDITION:
        res.locals.conditionsReferenceData = await referenceDataService.getConditions(req.user.username, false)
        break
      default:
        break
    }

    return next()
  }
}

export default retrieveReferenceData
