import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'

export default class AdditionalInformationController {
  getAdditionalInformationView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const additionalInformationForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: additionalInformationForm }
    return res.render('pages/education-support-plan/additional-information/index', viewRenderArgs)
  }

  submitAdditionalInformationForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const additionalInformationForm = { ...req.body }
    this.updateDtoFromForm(req, additionalInformationForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'next-review-date' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.additionalInformation == null) {
      return {}
    }
    return { additionalInformation: dto.additionalInformation }
  }

  private updateDtoFromForm = (req: Request, form: { additionalInformation: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.additionalInformation = form.additionalInformation
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
