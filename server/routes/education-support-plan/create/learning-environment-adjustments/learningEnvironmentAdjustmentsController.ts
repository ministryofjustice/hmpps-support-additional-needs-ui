import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class LearningEnvironmentAdjustmentsController {
  getLearningEnvironmentAdjustmentsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const learningEnvironmentAdjustmentsForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: learningEnvironmentAdjustmentsForm }
    return res.render('pages/education-support-plan/learning-environment-adjustments/index', viewRenderArgs)
  }

  submitLearningEnvironmentAdjustmentsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return res.redirect('teaching-adjustments')
  }
}
