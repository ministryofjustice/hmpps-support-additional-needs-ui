import { NextFunction, Request, Response } from 'express'
import type { StrengthDto } from 'dto'
import { PrisonUser } from '../../../interfaces/hmppsUser'

/**
 * Middleware function to check whether a [StrengthDto] exists in the journeyData for the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [StrengthDto] for the prisoner.
 */
const createEmptyStrengthDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  // Either no StrengthDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.strengthDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      strengthDto: {
        prisonNumber,
        prisonId: activeCaseLoadId,
      } as StrengthDto,
    }
  }

  next()
}

export default createEmptyStrengthDtoIfNotInJourneyData
