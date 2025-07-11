import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class EducationSupportPlanController {
  getEducationSupportPlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const viewRenderArgs = { prisonerSummary, tab: 'education-support-plan' }
    return res.render('pages/profile/education-support-plan/index', viewRenderArgs)
  }
}
