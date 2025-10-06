import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import PlanReviewedByValue from '../../../../enums/planReviewedByValue'

export default class WhoReviewedThePlanController {
  getWhoReviewedThePlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const whoReviewedThePlanForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: whoReviewedThePlanForm, mode: 'review' }
    return res.render('pages/education-support-plan/who-reviewed-the-plan/index', viewRenderArgs)
  }

  submitWhoReviewedThePlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const whoReviewedThePlanForm = { ...req.body }
    this.updateDtoFromForm(req, whoReviewedThePlanForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'other-people-consulted' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
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
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.planReviewedByLoggedInUser = form.reviewedBy === PlanReviewedByValue.MYSELF
    educationSupportPlanDto.planReviewedByOtherFullName = form.reviewedByOtherFullName
    educationSupportPlanDto.planReviewedByOtherJobRole = form.reviewedByOtherJobRole
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
