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

    return res.redirect('next-review-date')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.lnspSupportNeeded == null) {
      return {}
    }
    return {
      supportRequired: dto.lnspSupportNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dto.lnspSupport,
    }
  }

  private updateDtoFromForm = (req: Request, form: { supportRequired: YesNoValue; details?: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.lnspSupportNeeded = form.supportRequired === YesNoValue.YES
    educationSupportPlanDto.lnspSupport = form.details
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
