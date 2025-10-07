import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { EducationSupportPlanService } from '../../../../services'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Education Support Plan and store in the journey data
 *  if it exists, otherwise generate a 404 response
 */
const retrieveEducationSupportPlan = (educationSupportPlanService: EducationSupportPlanService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    if (
      req.journeyData?.educationSupportPlanDto != null &&
      req.journeyData.educationSupportPlanDto.prisonNumber !== prisonNumber
    ) {
      // ELSP in the journey data is for a different prisoner; redirect to the Profile Overview page
      return res.redirect(`/profile/${prisonNumber}/overview`)
    }

    if (req.journeyData?.educationSupportPlanDto?.prisonNumber === prisonNumber) {
      // ELSP is already in the journey data; no need to do anything else
      return next()
    }

    // Lookup the prisoner's ELSP and store in res.locals if it exists; else generate a 404 response
    try {
      const educationSupportPlanDto = await educationSupportPlanService.getEducationSupportPlan(
        req.user.username,
        prisonNumber,
      )
      if (educationSupportPlanDto) {
        req.journeyData = {
          ...req.journeyData,
          educationSupportPlanDto,
        }
        return next()
      }

      // Prisoner does not have an ELSP; generate a 404
      return next(createError(404, `No Education Learner Support Plan returned for prisoner ${prisonNumber}`))
    } catch {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect(`/profile/${prisonNumber}/overview`)
    }
  }
}

export default retrieveEducationSupportPlan
