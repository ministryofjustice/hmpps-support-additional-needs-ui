import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class StrengthsController {
  getStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, strengths } = res.locals
    const viewRenderArgs = { prisonerSummary, strengths, tab: 'strengths' }
    return res.render('pages/profile/strengths/index', viewRenderArgs)
  }
}
