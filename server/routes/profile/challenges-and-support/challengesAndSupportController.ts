import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedChallengesPromise from '../../utils/groupedChallengesMapper'
import toGroupedSupportStrategiesPromise from '../../utils/groupedSupportStrategiesMapper'

export default class ChallengesAndSupportController {
  getChallengesAndSupportView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {
      prisonerSummary,
      supportStrategies,
      challenges,
      alnScreeners,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
    } = res.locals

    const viewRenderArgs = {
      prisonNamesById,
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      tab: 'challenges-and-support',
      activeChallenges: toGroupedChallengesPromise({ challenges, alnScreeners, active: true }),
      archivedChallenges: toGroupedChallengesPromise({ challenges, alnScreeners, active: false }),
      activeSupportStrategies: toGroupedSupportStrategiesPromise({ supportStrategies, active: true }),
      archivedSupportStrategies: toGroupedSupportStrategiesPromise({ supportStrategies, active: false }),
    }
    return res.render('pages/profile/challenges-and-support/index', viewRenderArgs)
  }
}
