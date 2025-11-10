import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedStrengthsPromise from '../../../utils/groupedStrengthsMapper'

export default class ReviewExistingStrengthsController {
  getReviewExistingStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, prisonerSummary, prisonNamesById, strengths } = res.locals

    const groupedStrengthsPromise = toGroupedStrengthsPromise({
      strengths,
      alnScreeners,
      active: true,
    })

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      groupedStrengths: groupedStrengthsPromise,
      mode: 'review',
    }
    return res.render('pages/education-support-plan/review-existing-needs/strengths/index', viewRenderArgs)
  }

  submitReviewExistingStrengthsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('challenges')
  }
}
