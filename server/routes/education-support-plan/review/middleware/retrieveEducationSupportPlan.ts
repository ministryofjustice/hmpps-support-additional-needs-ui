import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { EducationSupportPlanService } from '../../../../services'
import { Result } from '../../../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Education Support Plan and store in res.locals
 *  if it exists, otherwise generate a 404 response
 */
const retrieveEducationSupportPlan = (educationSupportPlanService: EducationSupportPlanService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoner's ELSP and store in res.locals if it exists; else generate a 404 response
    try {
      const educationSupportPlan = await educationSupportPlanService.getEducationSupportPlan(
        req.user.username,
        prisonNumber,
      )
      if (educationSupportPlan) {
        res.locals.educationSupportPlan = await Result.wrap(Promise.resolve(educationSupportPlan))
        next()
      }

      // Prisoner does not have an ELSP; generate a 404
      next(createError(404, `No Education Learner Support Plan returned for prisoner ${prisonNumber}`))
    } catch {
      req.flash('pageHasApiErrors', 'true')
      res.redirect(`/profile/${prisonNumber}/overview`)
    }
  }
}

export default retrieveEducationSupportPlan
