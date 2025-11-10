import type { AlnScreenerList, ChallengeResponseDto } from 'dto'
import { Result } from '../../utils/result/result'
import { getChallengesFromAlnScreener, getLatestAlnScreener, getNonAlnChallenges } from './index'
import dateComparator from '../dateComparator'
import enumComparator from '../enumComparator'

type GroupedChallenges = Record<
  string,
  {
    nonAlnChallenges: Array<ChallengeResponseDto>
    latestAlnScreener: {
      screenerDate: Date
      createdAtPrison: string
      challenges: Array<ChallengeResponseDto>
    }
  }
>

const toGroupedChallengesPromise = (config: {
  challenges: Result<Array<ChallengeResponseDto>>
  alnScreeners: Result<AlnScreenerList>
  active: boolean
}): Result<GroupedChallenges, Error> => {
  const { challenges, alnScreeners, active } = config
  if (alnScreeners.isFulfilled() && challenges.isFulfilled()) {
    // Group and sort the data from the prisoner's non-ALN Challenges, and the Challenges from their latest ALN Screener
    const nonAlnChallenges = getNonAlnChallenges(challenges, active).sort((left, right) =>
      dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
    )
    const latestAlnScreener = getLatestAlnScreener(alnScreeners)
    const challengesFromLatestAlnScreener = getChallengesFromAlnScreener(latestAlnScreener, active).sort(
      (left, right) => enumComparator(left.challengeTypeCode, right.challengeTypeCode),
    )
    const screenerDate = latestAlnScreener?.screenerDate
    const prisonScreenerConductedAt = latestAlnScreener?.createdAtPrison

    const groupedChallenges: GroupedChallenges = {}
    addNonAlnChallengesToGroupedChallenges(groupedChallenges, nonAlnChallenges, screenerDate, prisonScreenerConductedAt)
    addAlnChallengesToGroupedChallenges(
      groupedChallenges,
      challengesFromLatestAlnScreener,
      screenerDate,
      prisonScreenerConductedAt,
    )

    const groupedChallengesSortedByCategory = Object.keys(groupedChallenges)
      .sort(enumComparator)
      .reduce((acc, category) => {
        acc[category] = groupedChallenges[category]
        return acc
      }, {} as GroupedChallenges)
    return Result.fulfilled(groupedChallengesSortedByCategory)
  }

  // At least one of the API calls has failed; we need data from both APIs in order to properly render the Challenges page
  // Return a rejected Result containing the error message(s) from the original rejected promise(s)
  return Result.rewrapRejected(alnScreeners, challenges)
}

const addNonAlnChallengesToGroupedChallenges = (
  groupedChallenges: GroupedChallenges,
  nonAlnChallenges: Array<ChallengeResponseDto>,
  screenerDate: Date,
  createdAtPrison: string,
) => {
  nonAlnChallenges.reduce((acc, challenge) => {
    const category = challenge.challengeCategory
    const currentEntry = acc[category] ?? {
      nonAlnChallenges: [],
      latestAlnScreener: { screenerDate, createdAtPrison, challenges: [] },
    }
    currentEntry.nonAlnChallenges.push({
      ...challenge,
      howIdentified: challenge.howIdentified?.sort(enumComparator),
    })
    acc[category] = currentEntry
    return acc
  }, groupedChallenges)
}

const addAlnChallengesToGroupedChallenges = (
  groupedChallenges: GroupedChallenges,
  alnChallenges: Array<ChallengeResponseDto>,
  screenerDate: Date,
  createdAtPrison: string,
) => {
  alnChallenges.reduce((acc, challenge) => {
    const category = challenge.challengeCategory
    const currentEntry = acc[category] ?? {
      nonAlnChallenges: [],
      latestAlnScreener: { screenerDate, createdAtPrison, challenges: [] },
    }
    currentEntry.latestAlnScreener = currentEntry.latestAlnScreener || { screenerDate, createdAtPrison, challenges: [] }
    currentEntry.latestAlnScreener.challenges.push(challenge)
    acc[category] = currentEntry
    return acc
  }, groupedChallenges)
}

export default toGroupedChallengesPromise
