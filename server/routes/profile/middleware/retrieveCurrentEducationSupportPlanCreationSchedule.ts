import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationSupportPlanScheduleService } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

/**
 *  Function that returns a middleware function to retrieve the prisoner's current Education Support Plan Creation Schedule and store in res.locals
 */
const retrieveCurrentEducationSupportPlanCreationSchedule = (
  educationSupportPlanScheduleService: EducationSupportPlanScheduleService,
): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoner's ELSP Creation Schedule and store in res.locals
    res.locals.educationSupportPlanCreationSchedule =
      await educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule(
        prisonNumber,
        req.user.username,
      )

    next()
  })
}

export default retrieveCurrentEducationSupportPlanCreationSchedule
