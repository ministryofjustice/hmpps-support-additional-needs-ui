import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ConditionsController {
  getConditionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, conditions, prisonNamesById, educationSupportPlanLifecycleStatus } = res.locals
    const viewRenderArgs = {
      prisonerSummary,
      conditions,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      tab: 'conditions',
    }
    return res.render('pages/profile/conditions/index', viewRenderArgs)
  }
}
