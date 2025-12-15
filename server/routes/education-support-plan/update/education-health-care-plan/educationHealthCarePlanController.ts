import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'
import { AuditService, EducationSupportPlanService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class EducationHealthCarePlanController {
  constructor(
    private readonly educationSupportPlanService: EducationSupportPlanService,
    private readonly auditService: AuditService,
  ) {}

  getEhcpView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const educationHealthCarePlanForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: educationHealthCarePlanForm, mode: 'edit' }
    return res.render('pages/education-support-plan/education-health-care-plan/index', viewRenderArgs)
  }

  submitEhcpForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { educationSupportPlanDto } = req.journeyData
    const { prisonNumber } = educationSupportPlanDto
    const ehcpForm = { ...req.body }
    this.updateDtoFromForm(req, ehcpForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser
    const updateEducationSupportPlanDto = { ...educationSupportPlanDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationSupportPlanService.updateEhcpStatus(username, prisonNumber, updateEducationSupportPlanDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('education-health-care-plan')
    }

    this.auditService.logUpdateEducationLearnerSupportPlan(this.updateEducationLearnerSupportPlanAuditData(req)) // no need to wait for response
    req.journeyData.educationSupportPlanDto = undefined

    return res.redirectWithSuccess(`/profile/${prisonNumber}/education-support-plan`, 'Education support plan updated')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.hasCurrentEhcp == null) {
      return {}
    }
    return { hasCurrentEhcp: dto.hasCurrentEhcp ? YesNoValue.YES : YesNoValue.NO }
  }

  private updateDtoFromForm = (req: Request, form: { hasCurrentEhcp: YesNoValue }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.hasCurrentEhcp = form.hasCurrentEhcp === YesNoValue.YES
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }

  private updateEducationLearnerSupportPlanAuditData = (req: Request): BaseAuditData => {
    return {
      details: {},
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
