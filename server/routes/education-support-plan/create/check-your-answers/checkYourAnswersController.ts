import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class CheckYourAnswersController {
  getCheckYourAnswersView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const viewRenderArgs = { prisonerSummary, dto: educationSupportPlanDto }
    return res.render('pages/education-support-plan/check-your-answers/index', viewRenderArgs)
  }

  submitCheckYourAnswersForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { educationSupportPlanDto } = req.journeyData
    const { prisonNumber } = educationSupportPlanDto

    // TODO - call API to save Education Support Plan

    req.journeyData.educationSupportPlanDto = undefined
    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Education support plan created')
  }
}
