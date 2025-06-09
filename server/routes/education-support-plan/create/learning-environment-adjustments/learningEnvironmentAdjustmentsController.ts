import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class LearningEnvironmentAdjustmentsController {
  getLearningEnvironmentAdjustmentsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const learningEnvironmentAdjustmentsForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: learningEnvironmentAdjustmentsForm }
    return res.render('pages/education-support-plan/learning-environment-adjustments/index', viewRenderArgs)
  }

  submitLearningEnvironmentAdjustmentsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const learningEnvironmentAdjustmentsForm = { ...req.body }
    this.updateDtoFromForm(req, learningEnvironmentAdjustmentsForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'teaching-adjustments' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.learningEnvironmentAdjustmentsNeeded == null) {
      return {}
    }
    return {
      adjustmentsNeeded: dto.learningEnvironmentAdjustmentsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dto.learningEnvironmentAdjustments,
    }
  }

  private updateDtoFromForm = (req: Request, form: { adjustmentsNeeded: YesNoValue; details?: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.learningEnvironmentAdjustmentsNeeded = form.adjustmentsNeeded === YesNoValue.YES
    educationSupportPlanDto.learningEnvironmentAdjustments = form.details
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
