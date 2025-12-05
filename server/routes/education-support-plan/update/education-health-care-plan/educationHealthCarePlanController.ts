import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'
import { AuditService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'

export default class EducationHealthCarePlanController {
  constructor(private readonly auditService: AuditService) {}

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

    // TODO - implement code here to update the EHCP answer in the ELSP

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
