import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedChallengesAndSupportPromise from '../../utils/groupedChallengesAndSupportMapper'

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
      activeChallengesAndSupport: toGroupedChallengesAndSupportPromise({
        challenges,
        alnScreeners,
        supportStrategies,
        active: true,
      }),
      archivedChallengesAndSupport: toGroupedChallengesAndSupportPromise({
        challenges,
        alnScreeners,
        supportStrategies,
        active: false,
      }),
    }
    return res.render('pages/profile/challenges-and-support/index', viewRenderArgs)
  }
}
