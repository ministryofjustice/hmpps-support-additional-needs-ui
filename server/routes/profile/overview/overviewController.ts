import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const viewRenderArgs = { prisonerSummary, tab: 'overview' }
    return res.render('pages/profile/overview/index', viewRenderArgs)
  }
}
