import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class ExamArrangementsController {
  getExamArrangementsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto, reviewEducationSupportPlanDto } = req.journeyData

    const currentAnswer = educationSupportPlanDto.examArrangementsNeeded
      ? educationSupportPlanDto.examArrangements
      : 'No'
    const examArrangementsForm =
      invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto, educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: examArrangementsForm, mode: 'review', currentAnswer }
    return res.render('pages/education-support-plan/exam-arrangements/index', viewRenderArgs)
  }

  submitExamArrangementsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const examArrangementsForm = { ...req.body }
    this.updateDtoFromForm(req, examArrangementsForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'lnsp-support' : 'check-your-answers')
  }

  private populateFormFromDto = (
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ) => {
    const dtoToBaseFormOn: EducationSupportPlanDto | ReviewEducationSupportPlanDto =
      reviewEducationSupportPlanDto.examArrangementsNeeded != null
        ? reviewEducationSupportPlanDto
        : educationSupportPlanDto
    return {
      arrangementsNeeded: dtoToBaseFormOn.examArrangementsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dtoToBaseFormOn.examArrangements,
    }
  }

  private updateDtoFromForm = (req: Request, form: { arrangementsNeeded: YesNoValue; details?: string }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.examArrangementsNeeded = form.arrangementsNeeded === YesNoValue.YES
    reviewEducationSupportPlanDto.examArrangements = form.details
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
