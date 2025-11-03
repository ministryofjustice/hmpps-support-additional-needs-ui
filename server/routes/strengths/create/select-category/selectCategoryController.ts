import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { StrengthDto } from 'dto'
import StrengthType from '../../../../enums/strengthType'

export default class SelectCategoryController {
  getSelectCategoryView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const strengthDto = req.journeyData.strengthDto as StrengthDto
    const selectCategoryForm = invalidForm ?? this.populateFormFromDto(strengthDto)

    const viewRenderArgs = { form: selectCategoryForm }
    return res.render('pages/strengths/select-category/index', viewRenderArgs)
  }

  submitSelectCategoryForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selectCategoryForm = { ...req.body }
    this.updateDtoFromForm(req, selectCategoryForm)

    return res.redirect('detail')
  }

  private populateFormFromDto = (dto: StrengthDto) => {
    return {
      category: dto.strengthTypeCode,
    }
  }

  private updateDtoFromForm = (req: Request, form: { category: StrengthType }) => {
    const { strengthDto } = req.journeyData
    strengthDto.strengthTypeCode = form.category
    req.journeyData.strengthDto = strengthDto
  }
}
