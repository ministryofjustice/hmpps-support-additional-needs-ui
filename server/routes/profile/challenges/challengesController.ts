import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ChallengesController {
  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const viewRenderArgs = { prisonerSummary, tab: 'challenges' }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }
}
