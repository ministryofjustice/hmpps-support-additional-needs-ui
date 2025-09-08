import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedChallengesPromise from '../../utils/groupedChallengesMapper'

export default class ChallengesController {
  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, challenges, alnScreeners, prisonNamesById, educationSupportPlanLifecycleStatus } =
      res.locals

    const groupedChallengesPromise = toGroupedChallengesPromise(challenges, alnScreeners)

    const viewRenderArgs = {
      prisonNamesById,
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      tab: 'challenges',
      groupedChallenges: groupedChallengesPromise,
    }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }
}
