import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AlnScreenerList, ChallengeResponseDto } from 'dto'
import { compareDesc } from 'date-fns'
import { Result } from '../../../utils/result/result'

interface GroupedChallenges {
  [key: string]: ChallengeResponseDto[]
}

export type GroupedStructuredChallenges = Record<
  string,
  {
    nonAlnChallenges: Array<ChallengeResponseDto>
    alnChallenges: Array<ChallengeResponseDto>
  }
>

export default class ChallengesController {
  getChallengesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, challenges, alnScreeners, prisonNamesById } = res.locals
    const alnScreenersResult = alnScreeners as Result<AlnScreenerList>

    let groupedChallengesPromise: Result<GroupedStructuredChallenges, Error>

    if (alnScreeners.isFulfilled() && challenges.isFulfilled()) {
      const alnScreenerResult = alnScreenersResult.getOrNull()
      const challengesResult = challenges.getOrNull()
      const groupedChallenges = this.getChallengesByType(challengesResult, alnScreenerResult)

      groupedChallengesPromise = Result.fulfilled(groupedChallenges)
    } else {
      groupedChallengesPromise = this.reWrapRejectedPromises(alnScreeners, challenges)
    }

    const viewRenderArgs = {
      prisonNamesById,
      prisonerSummary,
      tab: 'challenges',
      groupedChallenges: groupedChallengesPromise,
    }
    return res.render('pages/profile/challenges/index', viewRenderArgs)
  }

  getChallengesByType(
    challenges: ChallengeResponseDto[],
    alnScreenerList: AlnScreenerList,
  ): GroupedStructuredChallenges {
    const activeNonAlnChallenges = challenges.filter(challenge => challenge.active && !challenge.fromALNScreener)
    const latestAlnScreenerChallenges = this.getLatestAlnScreenerChallenges(alnScreenerList)

    const allChallenges = [...activeNonAlnChallenges, ...latestAlnScreenerChallenges].sort((a, b) => {
      return a.challengeCategory.localeCompare(b.challengeCategory)
    })
    const grouped = this.groupChallengesByCategory(allChallenges)
    return this.sortChallengeGroups(grouped)
  }

  private sortChallengeGroups(grouped: { [p: string]: ChallengeResponseDto[] }): GroupedStructuredChallenges {
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

        return [category, { nonAlnChallenges: [...nonAlnChallengesSortedByDate], alnChallenges: [...alnChallenges] }]
      })

    return Object.fromEntries(sortedEntries)
  }

  private groupChallengesByCategory(allChallenges: ChallengeResponseDto[]) {
    return allChallenges.reduce((grouped, challenge) => {
      const type = challenge.challengeCategory
      return {
        ...grouped,
        [type]: [...(grouped[type] || []), challenge],
      }
    }, {} as GroupedChallenges)
  }

  private getLatestAlnScreenerChallenges(alnScreenerList: AlnScreenerList): Array<ChallengeResponseDto> {
    if (!alnScreenerList?.screeners?.length) {
      return []
    }
    const sortedScreeners = [...alnScreenerList.screeners].sort((a, b) => compareDesc(a.screenerDate, b.screenerDate))
    const latestScreener = sortedScreeners[0]
    return latestScreener.challenges.filter(challenge => challenge.active)
  }

  private reWrapRejectedPromises = (
    alnScreeners: Result<AlnScreenerList>,
    challenges: Result<Array<ChallengeResponseDto>>,
  ): Result<GroupedStructuredChallenges> => {
    const apiErrorMessages = [alnScreeners, challenges]
      .map(result => (!result.isFulfilled() ? result : null))
      .filter(result => result != null)
      .map(result => result.getOrHandle(error => error.message))
      .join(', ')
    return Result.rejected(new Error(apiErrorMessages))
  }
}
