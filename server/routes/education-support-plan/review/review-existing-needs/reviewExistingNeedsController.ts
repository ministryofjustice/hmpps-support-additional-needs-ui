import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'
import config from '../../../../config'

export default class ReviewExistingNeedsController {
  getReviewExistingNeedsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { reviewEducationSupportPlanDto } = req.journeyData

    const reviewExistingNeedsForm = invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: reviewExistingNeedsForm, mode: 'review' }
    return res.render('pages/education-support-plan/review-existing-needs/index', viewRenderArgs)
  }

  submitReviewExistingNeedsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const reviewExistingNeedsForm = { ...req.body }
    this.updateDtoFromForm(req, reviewExistingNeedsForm)

    if (config.featureToggles.newEspJourneyEnabled) {
      return res.redirect('who-reviewed-the-plan')
    }

    return res.redirect(
      reviewExistingNeedsForm.reviewExistingNeeds === YesNoValue.NO
        ? 'teaching-adjustments'
        : 'review-existing-needs/strengths',
    )
  }

  private populateFormFromDto = (dto: ReviewEducationSupportPlanDto) => {
    if (dto.reviewExistingNeeds == null) {
      return {}
    }
    return { reviewExistingNeeds: dto.reviewExistingNeeds ? YesNoValue.YES : YesNoValue.NO }
  }

  private updateDtoFromForm = (req: Request, form: { reviewExistingNeeds: YesNoValue }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.reviewExistingNeeds = form.reviewExistingNeeds === YesNoValue.YES
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
