import { NextFunction, Request, Response } from 'express'
import type { AlnScreenerDto } from 'dto'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

/**
 * Middleware function to check whether a [AlnScreenerDto] exists in the journeyData for the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [AlnScreenerDto] for the prisoner.
 */
const createEmptyAlnScreenerDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  // Either no AlnScreenerDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.alnScreenerDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      alnScreenerDto: {
        prisonNumber,
        prisonId: activeCaseLoadId,
      } as AlnScreenerDto,
    }
  }

  next()
}

export default createEmptyAlnScreenerDtoIfNotInJourneyData
