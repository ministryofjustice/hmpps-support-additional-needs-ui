import { NextFunction, Request, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

/**
 * Middleware function that returns a request handler function to check whether a [ReviewEducationSupportPlanDto] exists in the journeyData for
 * the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [ReviewEducationSupportPlanDto] for the prisoner.
 */
const createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { prisonNumber } = req.params
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  // Either no ReviewEducationSupportPlanDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.reviewEducationSupportPlanDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      ...req.journeyData,
      reviewEducationSupportPlanDto: {
        prisonNumber,
        prisonId: activeCaseLoadId,
      } as ReviewEducationSupportPlanDto,
    }
  }

  next()
}

export default createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData
