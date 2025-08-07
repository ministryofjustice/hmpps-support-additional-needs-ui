import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ChallengeResponseDto } from 'dto'

interface GroupedChallenges {
  [key: string]: ChallengeResponseDto[]
}

export default class ChallengesController {
  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, challenges } = res.locals
    const viewRenderArgs = {
      prisonerSummary,
      tab: 'challenges',
      challengeList: challenges,
      groupedChallenges: this.getChallengesByType(challenges),
    }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }

  getChallengesByType(challenges: ChallengeResponseDto[]): GroupedChallenges {
    const grouped = challenges.reduce((grouped, challenge) => {
      const type = challenge.challengeCategory
      return {
        ...grouped,
        [type]: [...(grouped[type] || []), challenge],
      }
    }, {} as GroupedChallenges)

    return Object.fromEntries(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)))
  }
}
