import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'
import { format, parse } from 'date-fns'

export default class ReviewSupportPlanController {
  getReviewSupportPlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { reviewEducationSupportPlanDto } = req.journeyData

    const reviewSupportPlanForm = invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: reviewSupportPlanForm, mode: 'review' }
    return res.render('pages/education-support-plan/review-support-plan/index', viewRenderArgs)
  }

  submitReviewSupportPlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const reviewSupportPlanForm = { ...req.body }
    this.updateDtoFromForm(req, reviewSupportPlanForm)

    return res.redirect('check-your-answers')
  }

  private populateFormFromDto = (dto: ReviewEducationSupportPlanDto) => {
    if (dto.reviewDate == null) {
      return {}
    }
    return { reviewDate: format(dto.reviewDate, 'd/M/yyyy') }
  }

  private updateDtoFromForm = (req: Request, form: { reviewDate: string }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.reviewDate = parse(form.reviewDate, 'd/M/yyyy', new Date())
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
