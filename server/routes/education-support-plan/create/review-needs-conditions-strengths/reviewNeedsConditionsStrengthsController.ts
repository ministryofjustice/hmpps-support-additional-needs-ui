import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ReviewNeedsConditionsStrengthsController {
  getReviewNeedsConditionsStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals

    const viewRenderArgs = { prisonerSummary }
    return res.render('pages/education-support-plan/review-needs-conditions-strengths/index', viewRenderArgs)
  }

  submitReviewNeedsConditionsStrengthsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return res.redirect('learning-environment-adjustments')
  }
}
