import { NextFunction, Request, Response } from 'express'
import type { StrengthDto } from 'dto'

export default class DetailController {
  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { strengthDto } = req.journeyData

    const detailForm = invalidForm ?? this.populateFormFromDto(strengthDto)

    const viewRenderArgs = { form: detailForm, category: strengthDto.strengthTypeCode }
    return res.render('pages/strengths/detail/index', viewRenderArgs)
  }

  private populateFormFromDto = (dto: StrengthDto) => {
    return {
      description: dto.symptoms,
      howIdentified: dto.howIdentified || [],
      howIdentifiedOther: dto.howIdentifiedOther,
    }
  }
}
