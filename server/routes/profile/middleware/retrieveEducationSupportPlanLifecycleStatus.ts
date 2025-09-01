import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationSupportPlanService } from '../../../services'
import { Result } from '../../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Education Support Plan Lifecycle Status and store in res.locals
 */
const retrieveEducationSupportPlanLifecycleStatus = (
  educationSupportPlanService: EducationSupportPlanService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's ELSP Lifecycle Status and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.educationSupportPlanlifecycleStatus = await Result.wrap(
      educationSupportPlanService.getEducationSupportPlanLifecycleStatus(username, prisonNumber),
      apiErrorCallback,
    )

    next()
  }
}

export default retrieveEducationSupportPlanLifecycleStatus
