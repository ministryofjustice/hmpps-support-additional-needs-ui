import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class TeachingAdjustmentsController {
  getTeachingAdjustmentsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto, reviewEducationSupportPlanDto } = req.journeyData

    const currentAnswer = educationSupportPlanDto.teachingAdjustmentsNeeded
      ? educationSupportPlanDto.teachingAdjustments
      : 'No'
    const teachingAdjustmentsForm =
      invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto, educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: teachingAdjustmentsForm, mode: 'review', currentAnswer }
    return res.render('pages/education-support-plan/teaching-adjustments/index', viewRenderArgs)
  }

  submitTeachingAdjustmentsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const teachingAdjustmentsForm = { ...req.body }
    this.updateDtoFromForm(req, teachingAdjustmentsForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'specific-teaching-skills' : 'check-your-answers')
  }

  private populateFormFromDto = (
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ) => {
    const dtoToBaseFormOn: EducationSupportPlanDto | ReviewEducationSupportPlanDto =
      reviewEducationSupportPlanDto.teachingAdjustmentsNeeded != null
        ? reviewEducationSupportPlanDto
        : educationSupportPlanDto
    return {
      adjustmentsNeeded: dtoToBaseFormOn.teachingAdjustmentsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dtoToBaseFormOn.teachingAdjustments,
    }
  }

  private updateDtoFromForm = (req: Request, form: { adjustmentsNeeded: YesNoValue; details?: string }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.teachingAdjustmentsNeeded = form.adjustmentsNeeded === YesNoValue.YES
    reviewEducationSupportPlanDto.teachingAdjustments = form.details
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
