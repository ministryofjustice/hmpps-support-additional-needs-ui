import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SupportStrategiesController {
  getSupportStrategiesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, supportStrategies } = res.locals
    const viewRenderArgs = { prisonerSummary, tab: 'support-strategies', supportStrategies }
    return res.render('pages/profile/support-strategies/index', viewRenderArgs)
  }
}
