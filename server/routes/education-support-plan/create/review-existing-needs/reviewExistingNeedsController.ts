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

    return res.redirect('who-created-the-plan')
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
