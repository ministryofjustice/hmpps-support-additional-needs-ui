import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class EducationHealthCarePlanController {
  getEhcpView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const educationHealthCarePlanForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: educationHealthCarePlanForm }
    return res.render('pages/education-support-plan/education-health-care-plan/index', viewRenderArgs)
  }

  submitEhcpForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('lnsp-support')
  }
}
