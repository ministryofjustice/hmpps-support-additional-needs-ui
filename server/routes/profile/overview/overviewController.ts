import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedSupportStrategiesPromise from '../../utils/groupedSupportStrategiesMapper'
import toGroupedStrengthsPromise from '../../utils/groupedStrengthsMapper'
import toGroupedChallengesPromise from '../../utils/groupedChallengesMapper'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {
      prisonerSummary,
      alnScreeners,
      conditions,
      challenges,
      curiousAlnAndLddAssessments,
      educationSupportPlanLifecycleStatus,
      prisonNamesById,
      strengths,
      supportStrategies,
    } = res.locals

    const groupedStrengthsPromise = toGroupedStrengthsPromise({
      strengths,
      alnScreeners,
      active: true,
    })
    const groupedChallengesPromise = toGroupedChallengesPromise({ challenges, alnScreeners, active: true })
    const supportStrategiesPromise = toGroupedSupportStrategiesPromise({ supportStrategies, active: true })

    const viewRenderArgs = {
      prisonerSummary,
      conditions,
      educationSupportPlanLifecycleStatus,
      groupedStrengths: groupedStrengthsPromise,
      groupedChallenges: groupedChallengesPromise,
      curiousAlnAndLddAssessments,
      prisonNamesById,
      groupedSupportStrategies: supportStrategiesPromise,
      tab: 'overview',
    }
    return res.render('pages/profile/overview/index', viewRenderArgs)
  }
}
