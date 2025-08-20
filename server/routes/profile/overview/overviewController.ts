import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, conditions, educationSupportPlanCreationSchedule } = res.locals
    const viewRenderArgs = { prisonerSummary, conditions, educationSupportPlanCreationSchedule, tab: 'overview' }
    return res.render('pages/profile/overview/index', viewRenderArgs)
  }
}
