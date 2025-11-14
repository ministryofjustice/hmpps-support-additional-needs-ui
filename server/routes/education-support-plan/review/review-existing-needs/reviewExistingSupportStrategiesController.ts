import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedSupportStrategiesPromise from '../../../utils/groupedSupportStrategiesMapper'

export default class ReviewExistingSupportStrategiesController {
  getReviewExistingSupportStrategiesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, prisonNamesById, supportStrategies } = res.locals

    const groupedSupportStrategiesPromise = toGroupedSupportStrategiesPromise({ supportStrategies, active: true })

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      supportStrategies: groupedSupportStrategiesPromise,
      mode: 'review',
    }
    return res.render('pages/education-support-plan/review-existing-needs/support-strategies/index', viewRenderArgs)
  }

  submitReviewExistingSupportStrategiesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return res.redirect('../teaching-adjustments')
  }
}
