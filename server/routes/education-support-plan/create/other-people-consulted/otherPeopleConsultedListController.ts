import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class OtherPeopleConsultedListController {
  getOtherPeopleConsultedListView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const viewRenderArgs = { prisonerSummary, dto: educationSupportPlanDto }
    return res.render('pages/education-support-plan/other-people-consulted/people-consulted-list/index', viewRenderArgs)
  }

  submitOtherPeopleConsultedListForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('../review-needs-conditions-and-strengths')
  }
}
