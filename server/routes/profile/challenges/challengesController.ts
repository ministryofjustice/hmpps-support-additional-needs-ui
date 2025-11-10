import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedChallengesPromise from '../../utils/groupedChallengesMapper'

export default class ChallengesController {
  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, challenges, alnScreeners, prisonNamesById, educationSupportPlanLifecycleStatus } =
      res.locals

    const viewRenderArgs = {
      prisonNamesById,
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      tab: 'challenges',
      activeChallenges: toGroupedChallengesPromise({ challenges, alnScreeners, active: true }),
      archivedChallenges: toGroupedChallengesPromise({ challenges, alnScreeners, active: false }),
    }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }
}
