import { NextFunction, Request, Response } from 'express'
import type { AlnScreenerDto } from 'dto'

export default class AddStrengthsController {
  getAddStrengthsView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { alnScreenerDto } = req.journeyData

    const addStrengthsForm = invalidForm ?? this.populateFormFromDto(alnScreenerDto)

    const viewRenderArgs = { form: addStrengthsForm }
    return res.render('pages/additional-learning-needs-screener/add-strengths/index', viewRenderArgs)
  }

  private populateFormFromDto = (_dto: AlnScreenerDto) => {
    return {}
  }
}
