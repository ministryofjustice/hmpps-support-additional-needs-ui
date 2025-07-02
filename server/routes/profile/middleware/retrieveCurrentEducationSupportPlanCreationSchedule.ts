import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationSupportPlanScheduleService } from '../../../services'
import { Result } from '../../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's current Education Support Plan Creation Schedule and store in res.locals
 */
const retrieveCurrentEducationSupportPlanCreationSchedule = (
  educationSupportPlanScheduleService: EducationSupportPlanScheduleService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoner's ELSP Creation Schedule and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.educationSupportPlanCreationSchedule = await Result.wrap(
      educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule(
        prisonNumber,
        req.user.username,
      ),
      apiErrorCallback,
    )

    next()
  }
}

export default retrieveCurrentEducationSupportPlanCreationSchedule
