import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import { isEmpty } from '../../../../utils/validation/textValueValidator'

export default class AdditionalInformationController {
  getAdditionalInformationView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto, reviewEducationSupportPlanDto } = req.journeyData

    const currentAnswer = !isEmpty(educationSupportPlanDto.additionalInformation)
      ? educationSupportPlanDto.additionalInformation
      : 'None entered'
    const additionalInformationForm =
      invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto, educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: additionalInformationForm, mode: 'review', currentAnswer }
    return res.render('pages/education-support-plan/additional-information/index', viewRenderArgs)
  }

  submitAdditionalInformationForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const additionalInformationForm = { ...req.body }
    this.updateDtoFromForm(req, additionalInformationForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'next-review-date' : 'check-your-answers')
  }

  private populateFormFromDto = (
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ) => {
    const dtoToBaseFormOn: EducationSupportPlanDto | ReviewEducationSupportPlanDto =
      reviewEducationSupportPlanDto.additionalInformation != null
        ? reviewEducationSupportPlanDto
        : educationSupportPlanDto
    return { additionalInformation: dtoToBaseFormOn.additionalInformation }
  }

  private updateDtoFromForm = (req: Request, form: { additionalInformation: string }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.additionalInformation = form.additionalInformation
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
