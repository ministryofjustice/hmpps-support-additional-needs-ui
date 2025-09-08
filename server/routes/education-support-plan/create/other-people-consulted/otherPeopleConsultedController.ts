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

    const currentAnswer = req.journeyData.educationSupportPlanDto.wereOtherPeopleConsulted
    this.updateDtoFromForm(req, wereOtherPeopleConsultedForm)
    const updatedAnswer = req.journeyData.educationSupportPlanDto.wereOtherPeopleConsulted

    if (req.query?.submitToCheckAnswers === 'true') {
      // If the answer has not been changed, or it has been changed to No/false, redirect back to Check Your Answers
      if (currentAnswer === updatedAnswer || updatedAnswer === false) {
        return res.redirect('check-your-answers')
      }
      // The answer has been changed to Yes/true, so we need to redirect the user to the screens allowing them to add people
      return res.redirect('other-people-consulted/add-person?submitToCheckAnswers=true')
    }

    return res.redirect(
      wereOtherPeopleConsultedForm.wereOtherPeopleConsulted === YesNoValue.NO
        ? 'review-existing-needs'
        : 'other-people-consulted/add-person',
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
    // If wereOtherPeopleConsulted is No, remove the list of people from the DTO. Ensures a consistent view of the data
    // and allows for the user initially saying Yes and adding people, and then changing their mind to No
    if (form.wereOtherPeopleConsulted === YesNoValue.NO) {
      educationSupportPlanDto.otherPeopleConsulted = undefined
    }
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
