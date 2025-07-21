import { NextFunction, Request, Response } from 'express'
import type { AlnScreenerDto } from 'dto'

export default class AddChallengesController {
  getAddChallengesView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { alnScreenerDto } = req.journeyData

    const screenerDateForm = invalidForm ?? this.populateFormFromDto(alnScreenerDto)

    const viewRenderArgs = { form: screenerDateForm }
    return res.render('pages/additional-learning-needs-screener/add-challenges/index', viewRenderArgs)
  }

  private populateFormFromDto = (_dto: AlnScreenerDto) => {
    return {}
  }
}
