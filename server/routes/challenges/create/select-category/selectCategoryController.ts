import { NextFunction, Request, Response } from 'express'

export default class SelectCategoryController {
  async getSelectCategoryView(req: Request, res: Response, next: NextFunction) {
    const selectCategoryForm = {}

    const viewRenderArgs = { form: selectCategoryForm }
    return res.render('pages/strengths/select-category/index', viewRenderArgs)
  }
}
