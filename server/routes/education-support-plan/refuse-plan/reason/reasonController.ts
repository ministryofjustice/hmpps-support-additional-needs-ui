import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { RefuseEducationSupportPlanDto } from 'dto'
import { EducationSupportPlanService } from '../../../../services'
import PlanCreationScheduleExemptionReason from '../../../../enums/planCreationScheduleExemptionReason'
import { Result } from '../../../../utils/result/result'

export default class ReasonController {
  constructor(private readonly educationSupportPlanService: EducationSupportPlanService) {}

  getRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { refuseEducationSupportPlanDto } = req.journeyData

    const refusePlanReasonForm = invalidForm ?? this.populateFormFromDto(refuseEducationSupportPlanDto)

    const viewRenderArgs = {
      prisonerSummary,
      form: refusePlanReasonForm,
      errorRecordingEducationSupportPlanRefusal: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/education-support-plan/refuse-plan/reason/index', viewRenderArgs)
  }

  submitRefusePlanReasonView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const refusePlanReasonForm = { ...req.body }
    this.updateDtoFromForm(req, refusePlanReasonForm)

    const { refuseEducationSupportPlanDto } = req.journeyData
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationSupportPlanService.updateEducationSupportPlanCreationScheduleAsRefused(
        req.user.username,
        refuseEducationSupportPlanDto,
      ),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('reason')
    }

    const { prisonNumber } = refuseEducationSupportPlanDto
    req.journeyData.refuseEducationSupportPlanDto = undefined
    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Refusal of education support plan recorded')
  }

  private populateFormFromDto = (dto: RefuseEducationSupportPlanDto) => ({
    refusalReason: dto.reason,
    refusalReasonDetails: dto.details,
  })

  private updateDtoFromForm = (
    req: Request,
    form: { refusalReason: PlanCreationScheduleExemptionReason; refusalReasonDetails?: string },
  ) => {
    const { refuseEducationSupportPlanDto } = req.journeyData
    refuseEducationSupportPlanDto.reason = form.refusalReason
    refuseEducationSupportPlanDto.details = form.refusalReasonDetails
    req.journeyData.refuseEducationSupportPlanDto = refuseEducationSupportPlanDto
  }
}
