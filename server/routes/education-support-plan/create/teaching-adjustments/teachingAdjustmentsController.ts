import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class TeachingAdjustmentsController {
  getTeachingAdjustmentsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const teachingAdjustmentsForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: teachingAdjustmentsForm }
    return res.render('pages/education-support-plan/teaching-adjustments/index', viewRenderArgs)
  }

  submitTeachingAdjustmentsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const teachingAdjustmentsForm = { ...req.body }
    this.updateDtoFromForm(req, teachingAdjustmentsForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'specific-teaching-skills' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.teachingAdjustmentsNeeded == null) {
      return {}
    }
    return {
      adjustmentsNeeded: dto.teachingAdjustmentsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dto.teachingAdjustments,
    }
  }

  private updateDtoFromForm = (req: Request, form: { adjustmentsNeeded: YesNoValue; details?: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.teachingAdjustmentsNeeded = form.adjustmentsNeeded === YesNoValue.YES
    educationSupportPlanDto.teachingAdjustments = form.details
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
