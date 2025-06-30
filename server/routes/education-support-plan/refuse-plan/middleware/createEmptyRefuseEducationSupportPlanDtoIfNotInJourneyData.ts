import { NextFunction, Request, Response } from 'express'
import type { RefuseEducationSupportPlanDto } from 'dto'

/**
 * Middleware function that returns a request handler function to check whether a [RefuseEducationSupportPlanDto] exists in the journeyData for
 * the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [RefuseEducationSupportPlanDto] for the prisoner.
 */
const createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { prisonNumber } = req.params

  // Either no RefuseEducationSupportPlanDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.refuseEducationSupportPlanDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      refuseEducationSupportPlanDto: {
        prisonNumber,
      } as RefuseEducationSupportPlanDto,
    }
  }

  next()
}

export default createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData
