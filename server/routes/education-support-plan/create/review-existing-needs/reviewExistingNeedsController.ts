import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ReviewExistingNeedsController {
  getReviewExistingNeedsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals

    const viewRenderArgs = { prisonerSummary }
    return res.render('pages/education-support-plan/review-existing-needs/index', viewRenderArgs)
  }

  submitReviewExistingNeedsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('individual-support-requirements')
  }
}
