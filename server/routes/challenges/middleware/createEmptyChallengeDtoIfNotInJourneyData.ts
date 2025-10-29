import { NextFunction, Request, Response } from 'express'
import type { ChallengeDto } from 'dto'
import { PrisonUser } from '../../../interfaces/hmppsUser'

/**
 * Middleware function to check whether a [ChallengeDto] exists in the journeyData for the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty [ChallengeDto] for the prisoner.
 */
const createEmptyChallengeDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  // Either no ChallengeDto in the journeyData, or it's for a different prisoner. Create a new one.
  if (req.journeyData?.challengeDto?.prisonNumber !== prisonNumber) {
    req.journeyData = {
      challengeDto: {
        prisonNumber,
        prisonId: activeCaseLoadId,
      } as ChallengeDto,
    }
  }

  next()
}

export default createEmptyChallengeDtoIfNotInJourneyData
