import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedSupportStrategiesPromise from '../../utils/groupedSupportStrategiesMapper'

export default class SupportStrategiesController {
  getSupportStrategiesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, supportStrategies, educationSupportPlanLifecycleStatus, prisonNamesById } = res.locals

    const groupedSupportStrategiesPromise = toGroupedSupportStrategiesPromise(supportStrategies)

    const viewRenderArgs = {
      prisonerSummary,
      tab: 'support-strategies',
      educationSupportPlanLifecycleStatus,
      supportStrategies: groupedSupportStrategiesPromise,
      prisonNamesById,
    }
    return res.render('pages/profile/support-strategies/index', viewRenderArgs)
  }
}
