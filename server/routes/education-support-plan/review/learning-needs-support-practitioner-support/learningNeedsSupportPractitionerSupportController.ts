import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class LearningNeedsSupportPractitionerSupportController {
  getLnspSupportView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto, reviewEducationSupportPlanDto } = req.journeyData

    const currentAnswer = educationSupportPlanDto.lnspSupportNeeded ? educationSupportPlanDto.lnspSupport : 'No'
    const currentSupportHours = educationSupportPlanDto.lnspSupportHours
    const lnspSupportForm =
      invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto, educationSupportPlanDto)

    const viewRenderArgs = {
      prisonerSummary,
      form: lnspSupportForm,
      mode: 'review',
      currentAnswer,
      currentSupportHours,
    }
    return res.render('pages/education-support-plan/learning-needs-support-practitioner-support/index', viewRenderArgs)
  }

  submitLnspSupportForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const lnspSupportForm = { ...req.body }
    this.updateDtoFromForm(req, lnspSupportForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'additional-information' : 'check-your-answers')
  }

  private populateFormFromDto = (
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ) => {
    const dtoToBaseFormOn: EducationSupportPlanDto | ReviewEducationSupportPlanDto =
      reviewEducationSupportPlanDto.lnspSupportNeeded != null ? reviewEducationSupportPlanDto : educationSupportPlanDto
    return {
      supportRequired: dtoToBaseFormOn.lnspSupportNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dtoToBaseFormOn.lnspSupport,
      supportHours: dtoToBaseFormOn.lnspSupportHours,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { supportRequired: YesNoValue; details?: string; supportHours?: number },
  ) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.lnspSupportNeeded = form.supportRequired === YesNoValue.YES
    reviewEducationSupportPlanDto.lnspSupport = form.details
    reviewEducationSupportPlanDto.lnspSupportHours = form.supportHours ? Number(form.supportHours) : undefined
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
