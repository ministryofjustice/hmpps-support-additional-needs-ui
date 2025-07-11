import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class StrengthsController {
  getStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const viewRenderArgs = { prisonerSummary, tab: 'strengths' }
    return res.render('pages/profile/strengths/index', viewRenderArgs)
  }
}
