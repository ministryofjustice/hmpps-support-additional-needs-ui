import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { RefuseEducationSupportPlanDto } from 'dto'

export default class ReasonController {
  getRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { refuseEducationSupportPlanDto } = req.journeyData

    const refusePlanReasonForm = invalidForm ?? this.populateFormFromDto(refuseEducationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: refusePlanReasonForm }
    return res.render('pages/education-support-plan/refuse-plan/reason/index', viewRenderArgs)
  }

  submitRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    req.journeyData.refuseEducationSupportPlanDto = undefined
    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Refusal of education support plan recorded')
  }

  private populateFormFromDto = (dto: RefuseEducationSupportPlanDto) => ({
    refusalReason: dto.reason,
    refusalReasonDetails: dto.details,
  })
}
