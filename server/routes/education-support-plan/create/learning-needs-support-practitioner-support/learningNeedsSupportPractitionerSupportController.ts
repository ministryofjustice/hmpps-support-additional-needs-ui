import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class LearningNeedsSupportPractitionerSupportController {
  getLnspSupportView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const lnspSupportForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: lnspSupportForm }
    return res.render('pages/education-support-plan/learning-needs-support-practitioner-support/index', viewRenderArgs)
  }

  submitLnspSupportForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('next-review-date')
  }
}
