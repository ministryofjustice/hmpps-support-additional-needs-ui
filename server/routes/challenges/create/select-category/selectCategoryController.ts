import { NextFunction, Request, RequestHandler, Response } from 'express'
import StrengthCategory from '../../../../enums/strengthCategory'
import challengeCategory from '../../../../enums/challengeCategory'

export default class SelectCategoryController {
  async getSelectCategoryView(req: Request, res: Response, next: NextFunction) {
    const selectCategoryForm = {}

    const viewRenderArgs = { form: selectCategoryForm }
    return res.render('pages/challenges/select-category/index', viewRenderArgs)
  }

  submitSelectCategoryForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selectCategoryForm = { ...req.body }
    this.updateDtoFromForm(req, selectCategoryForm)

    return res.redirect('detail')
  }

  private updateDtoFromForm = (req: Request, form: { category: challengeCategory}) => {
    const { challengeDto } = req.journeyData
    challengeDto.challengeTypeCode = form.category
    req.journeyData.challengeDto = challengeDto
  }
}
