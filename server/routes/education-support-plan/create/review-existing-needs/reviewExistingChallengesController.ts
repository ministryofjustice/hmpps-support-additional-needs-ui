import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedChallengesPromise from '../../../utils/groupedChallengesMapper'

export default class ReviewExistingChallengesController {
  getReviewExistingChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, prisonerSummary, prisonNamesById, challenges } = res.locals

    const groupedChallengesPromise = toGroupedChallengesPromise(challenges, alnScreeners)

    const viewRenderArgs = { prisonerSummary, prisonNamesById, groupedChallenges: groupedChallengesPromise }
    return res.render('pages/education-support-plan/review-existing-needs/challenges/index', viewRenderArgs)
  }

  submitReviewExistingChallengesForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('conditions')
  }
}
