import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class OtherPeopleConsultedController {
  getOtherPeopleConsultedView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals

    const viewRenderArgs = { prisonerSummary }
    return res.render('pages/education-support-plan/other-people-consulted/index', viewRenderArgs)
  }

  submitOtherPeopleConsultedForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect(
      req.query?.submitToCheckAnswers !== 'true' ? 'review-needs-conditions-and-strengths' : 'check-your-answers',
    )
  }
}
