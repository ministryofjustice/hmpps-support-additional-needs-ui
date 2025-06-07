import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import PlanCreatedByValue from '../../../../enums/planCreatedByValue'

export default class WhoCreatedThePlanController {
  getWhoCreatedThePlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const whoCreatedThePlanForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: whoCreatedThePlanForm }
    return res.render('pages/education-support-plan/who-created-the-plan/index', viewRenderArgs)
  }

  submitWhoCreatedThePlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const whoCreatedThePlanForm = { ...req.body }
    this.updateDtoFromForm(req, whoCreatedThePlanForm)

    return res.redirect('other-people-consulted')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.planCreatedByLoggedInUser == null) {
      return {}
    }
    return {
      completedBy: dto.planCreatedByLoggedInUser ? PlanCreatedByValue.MYSELF : PlanCreatedByValue.SOMEBODY_ELSE,
      completedByOtherFullName: dto.planCreatedByOtherFullName,
      completedByOtherJobRole: dto.planCreatedByOtherJobRole,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { completedBy: PlanCreatedByValue; completedByOtherFullName?: string; completedByOtherJobRole?: string },
  ) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.planCreatedByLoggedInUser = form.completedBy === PlanCreatedByValue.MYSELF
    educationSupportPlanDto.planCreatedByOtherFullName = form.completedByOtherFullName
    educationSupportPlanDto.planCreatedByOtherJobRole = form.completedByOtherJobRole
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
