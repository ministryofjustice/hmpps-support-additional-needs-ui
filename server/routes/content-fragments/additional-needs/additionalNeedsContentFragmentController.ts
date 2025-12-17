import { NextFunction, Request, Response } from 'express'
import toGroupedStrengthsPromise from '../../utils/groupedStrengthsMapper'
import toGroupedChallengesPromise from '../../utils/groupedChallengesMapper'
import toGroupedSupportStrategiesPromise from '../../utils/groupedSupportStrategiesMapper'

export default class AdditionalNeedsContentFragmentController {
  getAdditionalNeedsContentFragment = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, conditions, challenges, strengths, supportStrategies } = res.locals

    const groupedStrengthsPromise = toGroupedStrengthsPromise({
      strengths,
      alnScreeners,
      active: true,
    })
    const groupedChallengesPromise = toGroupedChallengesPromise({ challenges, alnScreeners, active: true })
    const supportStrategiesPromise = toGroupedSupportStrategiesPromise({ supportStrategies, active: true })

    const viewRenderArgs = {
      conditions,
      groupedStrengths: groupedStrengthsPromise,
      groupedChallenges: groupedChallengesPromise,
      groupedSupportStrategies: supportStrategiesPromise,
    }
    return res.render('content-fragments/additional-needs/index', viewRenderArgs)
  }
}
