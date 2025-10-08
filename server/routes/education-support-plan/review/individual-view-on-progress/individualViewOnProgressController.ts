import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'

export default class IndividualViewOnProgressController {
  getIndividualViewOnProgressView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { reviewEducationSupportPlanDto } = req.journeyData

    const individualViewOnProgressForm = invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: individualViewOnProgressForm, mode: 'review' }
    return res.render('pages/education-support-plan/individual-view-on-progress/index', viewRenderArgs)
  }

  submitIndividualViewOnProgressForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const individualViewOnProgressForm = { ...req.body }
    this.updateDtoFromForm(req, individualViewOnProgressForm)

    return res.redirect(
      req.query?.submitToCheckAnswers !== 'true' ? 'reviewers-view-on-progress' : 'check-your-answers',
    )
  }

  private populateFormFromDto = (dto: ReviewEducationSupportPlanDto) => {
    return {
      prisonerViewOnProgress: dto.prisonerViewOnProgress,
      prisonerDeclinedBeingPartOfReview: dto.prisonerDeclinedBeingPartOfReview,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { prisonerViewOnProgress?: string; prisonerDeclinedBeingPartOfReview?: boolean },
  ) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.prisonerViewOnProgress =
      form.prisonerDeclinedBeingPartOfReview !== true ? form.prisonerViewOnProgress : undefined
    reviewEducationSupportPlanDto.prisonerDeclinedBeingPartOfReview = form.prisonerDeclinedBeingPartOfReview
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
