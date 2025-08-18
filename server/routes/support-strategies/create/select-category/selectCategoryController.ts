import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SupportStrategyDto } from 'dto'

export default class SelectCategoryController {
  getSelectCategoryView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { supportStrategyDto } = req.journeyData

    const selectCategoryForm = invalidForm ?? this.populateFormFromDto(supportStrategyDto)

    const viewRenderArgs = { form: selectCategoryForm }
    return res.render('pages/support-strategies/select-category/index', viewRenderArgs)
  }

  private populateFormFromDto = (dto: SupportStrategyDto) => {
    return {
      category: dto.supportStrategyTypeCode,
    }
  }
}
