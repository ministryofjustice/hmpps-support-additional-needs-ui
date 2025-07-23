import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ChallengeService } from '../../../services'

export default class ChallengesController {
  constructor(private readonly challengeService: ChallengeService) {}

  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const challenges = await this.challengeService.getChallenges(req.user.username, prisonerSummary.prisonNumber)
    const viewRenderArgs = { prisonerSummary, tab: 'challenges', challengeList: challenges }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }
}
