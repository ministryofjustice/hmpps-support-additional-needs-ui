import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SupportStrategyDto } from 'dto'
import SupportStrategyType from '../../../../enums/supportStrategyType'

export default class SelectCategoryController {
  getSelectCategoryView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { supportStrategyDto } = req.journeyData

    const selectCategoryForm = invalidForm ?? this.populateFormFromDto(supportStrategyDto)

    const viewRenderArgs = { form: selectCategoryForm }
    return res.render('pages/support-strategies/select-category/index', viewRenderArgs)
  }

  submitSelectCategoryForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selectCategoryForm = { ...req.body }
    this.updateDtoFromForm(req, selectCategoryForm)

    return res.redirect('detail')
  }

  private populateFormFromDto = (dto: SupportStrategyDto) => {
    return {
      category: dto.supportStrategyTypeCode,
    }
  }

  private updateDtoFromForm = (req: Request, form: { category: SupportStrategyType }) => {
    const { supportStrategyDto } = req.journeyData
    supportStrategyDto.supportStrategyTypeCode = form.category
    req.journeyData.supportStrategyDto = supportStrategyDto
  }
}
