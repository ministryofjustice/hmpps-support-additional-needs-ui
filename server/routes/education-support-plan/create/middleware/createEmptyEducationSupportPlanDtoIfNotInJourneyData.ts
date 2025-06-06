import { NextFunction, Request, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

/**
 * Middleware function that returns a request handler function to check whether a [EducationSupportPlanDto] exists in the journeyData for
 * the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [EducationSupportPlanDto] for the prisoner.
 */
const createEmptyEducationSupportPlanDtoIfNotInJourneyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { prisonNumber } = req.params
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  // Either no EducationSupportPlanDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.educationSupportPlanDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      educationSupportPlanDto: {
        prisonNumber,
        prisonId: activeCaseLoadId,
      } as EducationSupportPlanDto,
    }
  }

  next()
}

export default createEmptyEducationSupportPlanDtoIfNotInJourneyData
