import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationSupportPlanService } from '../../../services'
import { Result } from '../../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Education Support Plan and store in res.locals
 */
const retrieveEducationSupportPlan = (educationSupportPlanService: EducationSupportPlanService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoner's ELSP and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.educationSupportPlan = await Result.wrap(
      educationSupportPlanService.getEducationSupportPlan(prisonNumber, req.user.username),
      apiErrorCallback,
    )

    next()
  }
}

export default retrieveEducationSupportPlan
