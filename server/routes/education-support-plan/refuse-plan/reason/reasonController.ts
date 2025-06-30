import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ReasonController {
  getRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals

    const viewRenderArgs = {
      prisonerSummary,
      // dto: educationSupportPlanDto,
      // errorSavingEducationSupportPlan: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/education-support-plan/refuse-plan/reason/index', viewRenderArgs)
  }

  submitRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Refusal of education support plan recorded')
  }
}
