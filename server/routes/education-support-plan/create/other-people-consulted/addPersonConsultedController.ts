import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class AddPersonConsultedController {
  getAddPersonConsultedView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const addPersonConsultedForm = invalidForm ?? {}

    const viewRenderArgs = { prisonerSummary, form: addPersonConsultedForm }
    return res.render('pages/education-support-plan/other-people-consulted/add-person-consulted/index', viewRenderArgs)
  }

  submitAddPersonConsultedForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const addPersonConsultedForm = { ...req.body }
    this.updateDtoFromForm(req, addPersonConsultedForm)

    return res.redirect('list')
  }

  private updateDtoFromForm = (req: Request, form: { fullName: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    if (educationSupportPlanDto.otherPeopleConsulted == null) {
      educationSupportPlanDto.otherPeopleConsulted = []
    }
    educationSupportPlanDto.otherPeopleConsulted.push({ name: form.fullName, jobRole: 'N/A' })
    educationSupportPlanDto.wereOtherPeopleConsulted = true
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
