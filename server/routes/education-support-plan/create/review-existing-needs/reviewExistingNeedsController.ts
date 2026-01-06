import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'
import config from '../../../../config'

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

    if (config.featureToggles.newEspJourneyEnabled) {
      return res.redirect('who-created-the-plan')
    }

    return res.redirect(
      reviewExistingNeedsForm.reviewExistingNeeds === YesNoValue.NO
        ? 'individual-support-requirements'
        : 'review-existing-needs/strengths',
    )
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.reviewExistingNeeds == null) {
      return {}
    }
    return { reviewExistingNeeds: dto.reviewExistingNeeds ? YesNoValue.YES : YesNoValue.NO }
  }

  private updateDtoFromForm = (req: Request, form: { reviewExistingNeeds: YesNoValue }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.reviewExistingNeeds = form.reviewExistingNeeds === YesNoValue.YES
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
