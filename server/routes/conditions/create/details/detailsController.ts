import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class DetailsController {
  getDetailsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const { conditionsList } = req.journeyData

    const selectDetailsForm = {}

    const viewRenderArgs = { prisonerSummary, form: selectDetailsForm, dto: conditionsList }
    return res.render('pages/conditions/details/index', viewRenderArgs)
  }
}
