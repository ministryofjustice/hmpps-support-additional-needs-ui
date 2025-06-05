import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class TeachingAdjustmentsController {
  getTeachingAdjustmentsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const teachingAdjustmentsForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: teachingAdjustmentsForm }
    return res.render('pages/education-support-plan/teaching-adjustments/index', viewRenderArgs)
  }

  submitTeachingAdjustmentsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('specific-teaching-skills')
  }
}
