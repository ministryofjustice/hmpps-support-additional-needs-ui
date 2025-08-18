import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyDto } from 'dto'

export default class DetailController {
  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { supportStrategyDto } = req.journeyData

    const detailForm = invalidForm ?? this.populateFormFromDto(supportStrategyDto)

    const viewRenderArgs = {
      form: detailForm,
      category: supportStrategyDto.supportStrategyTypeCode,
      errorRecordingSupportStrategy: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/support-strategies/detail/index', viewRenderArgs)
  }

  private populateFormFromDto = (dto: SupportStrategyDto) => {
    return {
      description: dto.supportStrategyDetails,
    }
  }
}
