import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ReasonController {
  getRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const refusePlanReasonForm = invalidForm ?? undefined

    const viewRenderArgs = { prisonerSummary, form: refusePlanReasonForm }
    return res.render('pages/education-support-plan/refuse-plan/reason/index', viewRenderArgs)
  }

  submitRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Refusal of education support plan recorded')
  }
}
