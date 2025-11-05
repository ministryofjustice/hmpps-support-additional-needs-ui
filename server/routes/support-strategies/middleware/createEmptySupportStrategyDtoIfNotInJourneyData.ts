import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyDto } from 'dto'
import { PrisonUser } from '../../../interfaces/hmppsUser'

/**
 * Middleware function to check whether a [SupportStrategyDto] exists in the journeyData for the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [SupportStrategyDto] for the prisoner.
 */
const createEmptySupportStrategyDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  // Either no SupportStrategyDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.supportStrategyDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      supportStrategyDto: {
        prisonNumber,
        prisonId: activeCaseLoadId,
      } as SupportStrategyDto,
    }
  }

  next()
}

export default createEmptySupportStrategyDtoIfNotInJourneyData
