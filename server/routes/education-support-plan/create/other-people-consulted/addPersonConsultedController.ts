import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'

export default class AddPersonConsultedController {
  getAddPersonConsultedView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const addPersonConsultedForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: addPersonConsultedForm }
    return res.render('pages/education-support-plan/other-people-consulted/add-person-consulted/index', viewRenderArgs)
  }

  submitAddPersonConsultedForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const addPersonConsultedForm = { ...req.body }
    this.updateDtoFromForm(req, addPersonConsultedForm)

    return res.redirect('list')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.otherPeopleConsulted == null || dto.otherPeopleConsulted.length === 0) {
      return {}
    }
    return { fullName: dto.otherPeopleConsulted[0].name }
  }

  private updateDtoFromForm = (req: Request, form: { fullName: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    if (educationSupportPlanDto.otherPeopleConsulted == null) {
      educationSupportPlanDto.otherPeopleConsulted = []
    }
    educationSupportPlanDto.otherPeopleConsulted[0] = { name: form.fullName, jobRole: 'N/A' }
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
