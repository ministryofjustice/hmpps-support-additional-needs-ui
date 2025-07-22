import { NextFunction, Request, Response } from 'express'
import type { AlnScreenerDto } from 'dto'
import StrengthType from '../../../../enums/strengthType'

export default class AddStrengthsController {
  getAddStrengthsView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { alnScreenerDto } = req.journeyData

    const addStrengthsForm = invalidForm ?? this.populateFormFromDto(alnScreenerDto)

    const viewRenderArgs = { form: addStrengthsForm }
    return res.render('pages/additional-learning-needs-screener/add-strengths/index', viewRenderArgs)
  }

  submitAddStrengthsForm = async (req: Request, res: Response, next: NextFunction) => {
    const addStrengthsForm = { ...req.body }
    this.updateDtoFromForm(req, addStrengthsForm)

    return res.redirect('check-your-answers')
  }

  private populateFormFromDto = (dto: AlnScreenerDto) => {
    return {
      strengthTypeCodes: dto.strengths ?? [],
    }
  }

  private updateDtoFromForm = (req: Request, form: { strengthTypeCodes: Array<StrengthType> }) => {
    const { alnScreenerDto } = req.journeyData
    alnScreenerDto.strengths = form.strengthTypeCodes
    req.journeyData.educationSupportPlanDto = alnScreenerDto
  }
}
