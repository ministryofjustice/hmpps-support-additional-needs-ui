import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'
import PlanReviewedByValue from '../../../../enums/planReviewedByValue'

export default class WhoReviewedThePlanController {
  getWhoReviewedThePlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { reviewEducationSupportPlanDto } = req.journeyData

    const whoReviewedThePlanForm = invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: whoReviewedThePlanForm, mode: 'review' }
    return res.render('pages/education-support-plan/who-reviewed-the-plan/index', viewRenderArgs)
  }

  submitWhoReviewedThePlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const whoReviewedThePlanForm = { ...req.body }
    this.updateDtoFromForm(req, whoReviewedThePlanForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'other-people-consulted' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: ReviewEducationSupportPlanDto) => {
    if (dto.planReviewedByLoggedInUser == null) {
      return {}
    }
    return {
      reviewedBy: dto.planReviewedByLoggedInUser ? PlanReviewedByValue.MYSELF : PlanReviewedByValue.SOMEBODY_ELSE,
      reviewedByOtherFullName: dto.planReviewedByOtherFullName,
      reviewedByOtherJobRole: dto.planReviewedByOtherJobRole,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { reviewedBy: PlanReviewedByValue; reviewedByOtherFullName?: string; reviewedByOtherJobRole?: string },
  ) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.planReviewedByLoggedInUser = form.reviewedBy === PlanReviewedByValue.MYSELF
    reviewEducationSupportPlanDto.planReviewedByOtherFullName = form.reviewedByOtherFullName
    reviewEducationSupportPlanDto.planReviewedByOtherJobRole = form.reviewedByOtherJobRole
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
