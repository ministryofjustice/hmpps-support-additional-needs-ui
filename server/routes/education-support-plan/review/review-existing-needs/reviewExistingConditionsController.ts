import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ReviewExistingConditionsController {
  getReviewExistingConditionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, prisonNamesById, conditions } = res.locals

    const viewRenderArgs = { prisonerSummary, prisonNamesById, conditions, mode: 'review' }
    return res.render('pages/education-support-plan/review-existing-needs/conditions/index', viewRenderArgs)
  }

  submitReviewExistingConditionsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('support-strategies')
  }
}
