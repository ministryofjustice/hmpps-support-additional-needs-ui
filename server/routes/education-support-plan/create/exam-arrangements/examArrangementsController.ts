import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class ExamArrangementsController {
  getExamArrangementsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const examArrangementsForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: examArrangementsForm }
    return res.render('pages/education-support-plan/exam-arrangements/index', viewRenderArgs)
  }

  submitExamArrangementsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const examArrangementsForm = { ...req.body }
    this.updateDtoFromForm(req, examArrangementsForm)

    return res.redirect(
      req.query?.submitToCheckAnswers !== 'true' ? 'education-health-care-plan' : 'check-your-answers',
    )
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.examArrangementsNeeded == null) {
      return {}
    }
    return {
      arrangementsNeeded: dto.examArrangementsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dto.examArrangements,
    }
  }

  private updateDtoFromForm = (req: Request, form: { arrangementsNeeded: YesNoValue; details?: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.examArrangementsNeeded = form.arrangementsNeeded === YesNoValue.YES
    educationSupportPlanDto.examArrangements = form.details
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
