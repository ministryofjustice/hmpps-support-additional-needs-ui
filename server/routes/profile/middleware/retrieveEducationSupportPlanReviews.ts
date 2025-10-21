import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationSupportPlanReviewService } from '../../../services'
import { Result } from '../../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Education Support Plan Reviews and store in res.locals
 */
const retrieveEducationSupportPlanReviews = (
  educationSupportPlanReviewService: EducationSupportPlanReviewService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoner's ELSP Reviews and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.educationSupportPlanReviews = await Result.wrap(
      educationSupportPlanReviewService.getEducationSupportPlanReviews(req.user.username, prisonNumber),
      apiErrorCallback,
    )

    next()
  }
}

export default retrieveEducationSupportPlanReviews
