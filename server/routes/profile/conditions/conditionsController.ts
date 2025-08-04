import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ConditionsController {
  getConditionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, conditions } = res.locals
    const viewRenderArgs = { prisonerSummary, conditions, tab: 'conditions' }
    return res.render('pages/profile/conditions/index', viewRenderArgs)
  }
}
