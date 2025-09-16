import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class ReviewExistingNeedsController {
  getReviewExistingNeedsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const reviewExistingNeedsForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: reviewExistingNeedsForm }
    return res.render('pages/education-support-plan/review-existing-needs/index', viewRenderArgs)
  }

  submitReviewExistingNeedsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const reviewExistingNeedsForm = { ...req.body }
    this.updateDtoFromForm(req, reviewExistingNeedsForm)

    return res.redirect(
      reviewExistingNeedsForm.reviewBeforeCreatingPlan === YesNoValue.NO
        ? 'individual-support-requirements'
        : 'review-existing-needs/strengths',
    )
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.reviewBeforeCreatingPlan == null) {
      return {}
    }
    return { reviewBeforeCreatingPlan: dto.reviewBeforeCreatingPlan ? YesNoValue.YES : YesNoValue.NO }
  }

  private updateDtoFromForm = (req: Request, form: { reviewBeforeCreatingPlan: YesNoValue }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.reviewBeforeCreatingPlan = form.reviewBeforeCreatingPlan === YesNoValue.YES
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
