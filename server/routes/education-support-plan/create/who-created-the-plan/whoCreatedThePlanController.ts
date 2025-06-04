import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class WhoCreatedThePlanController {
  getWhoCreatedThePlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const whoCreatedThePlanForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: whoCreatedThePlanForm }
    return res.render('pages/education-support-plan/who-created-the-plan/index', viewRenderArgs)
  }

  submitWhoCreatedThePlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const whoCreatedThePlanForm = { ...req.body }
    // TODO - update DTO in journeyData with contents of form before redirecting to next page

    return res.redirect('other-people-consulted')
  }
}
