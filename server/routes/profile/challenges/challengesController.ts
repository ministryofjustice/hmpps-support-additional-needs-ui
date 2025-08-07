import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AlnScreenerList, AlnScreenerResponseDto, ChallengeResponseDto } from 'dto'
import { compareDesc } from 'date-fns'
import { Result } from '../../../utils/result/result'

interface GroupedChallenges {
  [key: string]: ChallengeResponseDto[]
}

function getLatestAlnScreenerChallenges(alnScreenerList: AlnScreenerList): Array<ChallengeResponseDto> {
  if (!alnScreenerList?.screeners?.length) {
    return []
  }
  const sortedScreeners = [...alnScreenerList.screeners].sort((a, b) => compareDesc(a.screenerDate, b.screenerDate))
  const latestScreener = sortedScreeners[0]
  return latestScreener.challenges.filter(challenge => challenge.active)
}

export default class ChallengesController {
  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, challenges, alnScreeners } = res.locals
    const alnScreenersResult = alnScreeners as Result<AlnScreenerList>
    const viewRenderArgs = {
      prisonerSummary,
      tab: 'challenges',
      challengeList: challenges,
      groupedChallenges: this.getChallengesByType(challenges, alnScreenersResult.getOrNull()),
    }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }

  getChallengesByType(challenges: ChallengeResponseDto[], alnScreenerList: AlnScreenerList): GroupedChallenges {
    const activeNonAlnChallenges = challenges.filter(challenge => challenge.active && !challenge.fromALNScreener)
    const latestAlnScreenerChallenges = getLatestAlnScreenerChallenges(alnScreenerList)

    const allChallenges = [...activeNonAlnChallenges, ...latestAlnScreenerChallenges].sort((a, b) => {
      return a.challengeCategory.localeCompare(b.challengeCategory)
    })

    const grouped = allChallenges.reduce((grouped, challenge) => {
      const type = challenge.challengeCategory
      return {
        ...grouped,
        [type]: [...(grouped[type] || []), challenge],
      }
    }, {} as GroupedChallenges)

    const sortedEntries = Object.entries(grouped)
      .sort(([categoryA], [categoryB]) => {
        return categoryA.localeCompare(categoryB)
      })
      .map(([category, challenges]) => {
        const nonAlnChallengesSortedByDate = [...challenges]
          .filter(challenge => !challenge.fromALNScreener)
          .sort((a, b) => compareDesc(a.createdAt, b.createdAt))
        const alnChallenges = [...challenges]
          .filter(challenge => challenge.fromALNScreener)
          .sort((a, b) => a.challengeTypeCode.localeCompare(b.challengeTypeCode))

        return [
          category,
          [...nonAlnChallengesSortedByDate, ...alnChallenges]
        ]
      })

    return Object.fromEntries(sortedEntries)
  }
}
