import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ExamArrangementsController {
  getExamArrangementsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const examArrangementsForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: examArrangementsForm }
    return res.render('pages/education-support-plan/exam-arrangements/index', viewRenderArgs)
  }

  submitExamArrangementsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('ehcp')
  }
}
