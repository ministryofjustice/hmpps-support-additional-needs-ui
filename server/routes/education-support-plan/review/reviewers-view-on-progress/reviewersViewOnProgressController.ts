import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'

export default class ReviewersViewOnProgressController {
  getReviewersViewOnProgressView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { reviewEducationSupportPlanDto } = req.journeyData

    const reviewersViewOnProgressForm = invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: reviewersViewOnProgressForm, mode: 'review' }
    return res.render('pages/education-support-plan/reviewers-view-on-progress/index', viewRenderArgs)
  }

  submitReviewersViewOnProgressForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const reviewersViewOnProgressForm = { ...req.body }
    this.updateDtoFromForm(req, reviewersViewOnProgressForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'review-existing-needs' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: ReviewEducationSupportPlanDto) => {
    return {
      reviewersViewOnProgress: dto.reviewersViewOnProgress,
    }
  }

  private updateDtoFromForm = (req: Request, form: { reviewersViewOnProgress: string }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.reviewersViewOnProgress = form.reviewersViewOnProgress
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
