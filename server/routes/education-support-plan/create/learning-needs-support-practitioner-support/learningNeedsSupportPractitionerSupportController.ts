import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class LearningNeedsSupportPractitionerSupportController {
  getLnspSupportView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const lnspSupportForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: lnspSupportForm }
    return res.render('pages/education-support-plan/learning-needs-support-practitioner-support/index', viewRenderArgs)
  }

  submitLnspSupportForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const lnspSupportForm = { ...req.body }
    this.updateDtoFromForm(req, lnspSupportForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'additional-information' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.lnspSupportNeeded == null) {
      return {}
    }
    return {
      supportRequired: dto.lnspSupportNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dto.lnspSupport,
      supportHours: dto.lnspSupportHours,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { supportRequired: YesNoValue; details?: string; supportHours?: number },
  ) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.lnspSupportNeeded = form.supportRequired === YesNoValue.YES
    educationSupportPlanDto.lnspSupport = form.details
    educationSupportPlanDto.lnspSupportHours = form.supportHours ? Number(form.supportHours) : undefined
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
