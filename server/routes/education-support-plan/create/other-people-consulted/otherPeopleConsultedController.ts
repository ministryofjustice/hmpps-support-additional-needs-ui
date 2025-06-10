import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class OtherPeopleConsultedController {
  getOtherPeopleConsultedView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const wereOtherPeopleConsultedForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: wereOtherPeopleConsultedForm }
    return res.render('pages/education-support-plan/other-people-consulted/index', viewRenderArgs)
  }

  submitOtherPeopleConsultedForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const wereOtherPeopleConsultedForm = { ...req.body }
    this.updateDtoFromForm(req, wereOtherPeopleConsultedForm)

    return res.redirect(
      req.query?.submitToCheckAnswers !== 'true' ? 'review-needs-conditions-and-strengths' : 'check-your-answers',
    )
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.wereOtherPeopleConsulted == null) {
      return {}
    }
    return { wereOtherPeopleConsulted: dto.wereOtherPeopleConsulted ? YesNoValue.YES : YesNoValue.NO }
  }

  private updateDtoFromForm = (req: Request, form: { wereOtherPeopleConsulted: YesNoValue }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.wereOtherPeopleConsulted = form.wereOtherPeopleConsulted === YesNoValue.YES
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
