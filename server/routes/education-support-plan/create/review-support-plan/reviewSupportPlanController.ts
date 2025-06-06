import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import { format, parse } from 'date-fns'

export default class ReviewSupportPlanController {
  getReviewSupportPlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const reviewSupportPlanForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: reviewSupportPlanForm }
    return res.render('pages/education-support-plan/review-support-plan/index', viewRenderArgs)
  }

  submitReviewSupportPlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const reviewSupportPlanForm = { ...req.body }
    this.updateDtoFromForm(req, reviewSupportPlanForm)

    return res.redirect('check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.reviewDate == null) {
      return {}
    }
    return { reviewDate: format(dto.reviewDate, 'd/M/yyyy') }
  }

  private updateDtoFromForm = (req: Request, form: { reviewDate: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.reviewDate = parse(form.reviewDate, 'd/M/yyyy', new Date())
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
