import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class EducationHealthCarePlanController {
  getEhcpView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const educationHealthCarePlanForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: educationHealthCarePlanForm }
    return res.render('pages/education-support-plan/education-health-care-plan/index', viewRenderArgs)
  }

  submitEhcpForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const ehcpForm = { ...req.body }
    this.updateDtoFromForm(req, ehcpForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'lnsp-support' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.currentEhcp == null) {
      return {}
    }
    return { currentEhcp: dto.currentEhcp ? YesNoValue.YES : YesNoValue.NO }
  }

  private updateDtoFromForm = (req: Request, form: { currentEhcp: YesNoValue }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.currentEhcp = form.currentEhcp === YesNoValue.YES
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
