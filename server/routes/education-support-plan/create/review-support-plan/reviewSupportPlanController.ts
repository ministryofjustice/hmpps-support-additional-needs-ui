import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ReviewSupportPlanController {
  getReviewSupportPlanView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const reviewSupportPlanForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: reviewSupportPlanForm }
    return res.render('pages/education-support-plan/review-support-plan/index', viewRenderArgs)
  }

  submitReviewSupportPlanForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('check-your-answers')
  }
}
