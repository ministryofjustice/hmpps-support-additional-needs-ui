import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { RefuseEducationSupportPlanDto } from 'dto'
import { EducationSupportPlanScheduleService } from '../../../../services'
import PlanCreationScheduleExemptionReason from '../../../../enums/planCreationScheduleExemptionReason'
import { Result } from '../../../../utils/result/result'
import AuditService, { BaseAuditData } from '../../../../services/auditService'

export default class ReasonController {
  constructor(
    private readonly educationSupportPlanScheduleService: EducationSupportPlanScheduleService,
    private readonly auditService: AuditService,
  ) {}

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
      this.educationSupportPlanScheduleService.updateEducationSupportPlanCreationScheduleAsRefused(
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
    this.auditService.logUpdateEducationLearnerSupportPlanAsRefused(
      this.refusedEducationLearnerSupportPlanAuditData(req, refuseEducationSupportPlanDto.reason),
    ) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Refusal of education support plan recorded')
  }

  private populateFormFromDto = (dto: RefuseEducationSupportPlanDto) => ({
    refusalReason: dto.reason,
    refusalReasonDetails: { [dto.reason]: dto.details },
  })

  private updateDtoFromForm = (
    req: Request,
    form: {
      refusalReason: PlanCreationScheduleExemptionReason
      refusalReasonDetails?: Record<PlanCreationScheduleExemptionReason, string>
    },
  ) => {
    const { refuseEducationSupportPlanDto } = req.journeyData
    refuseEducationSupportPlanDto.reason = form.refusalReason
    refuseEducationSupportPlanDto.details = form.refusalReasonDetails[form.refusalReason]
    req.journeyData.refuseEducationSupportPlanDto = refuseEducationSupportPlanDto
  }

  private refusedEducationLearnerSupportPlanAuditData = (
    req: Request,
    reason: PlanCreationScheduleExemptionReason,
  ): BaseAuditData => {
    return {
      details: { reason },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
