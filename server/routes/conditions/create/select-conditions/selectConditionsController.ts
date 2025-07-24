import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SelectConditionsController {
  getSelectConditionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const selectConditionsForm = invalidForm ?? {}

    const viewRenderArgs = { prisonerSummary, form: selectConditionsForm }
    return res.render('pages/conditions/select-conditions/index', viewRenderArgs)
  }
}
