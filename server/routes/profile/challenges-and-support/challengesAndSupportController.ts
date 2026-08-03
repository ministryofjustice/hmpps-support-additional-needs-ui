import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ChallengesAndSupportController {
  getChallengesAndSupportView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals

    const viewRenderArgs = {
      prisonerSummary,
      tab: 'challenges-and-support',
    }
    return res.render('pages/profile/challenges-and-support/index', viewRenderArgs)
  }
}
