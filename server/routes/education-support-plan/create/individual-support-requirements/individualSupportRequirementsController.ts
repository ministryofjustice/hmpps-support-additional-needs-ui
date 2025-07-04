import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'

export default class IndividualSupportRequirementsController {
  getIndividualSupportRequirementsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const individualSupportRequirementsForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: individualSupportRequirementsForm }
    return res.render('pages/education-support-plan/individual-support-requirements/index', viewRenderArgs)
  }

  submitIndividualSupportRequirementsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const examArrangementsForm = { ...req.body }
    this.updateDtoFromForm(req, examArrangementsForm)

    return res.redirect(
      req.query?.submitToCheckAnswers !== 'true' ? 'learning-environment-adjustments' : 'check-your-answers',
    )
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    return {
      supportRequirements: dto.individualSupport,
    }
  }

  private updateDtoFromForm = (req: Request, form: { supportRequirements: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.individualSupport = form.supportRequirements
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
