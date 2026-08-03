import type { AlnScreenerList, ChallengeResponseDto, SupportStrategyResponseDto } from 'dto'
import { Result } from '../../utils/result/result'
import { getChallengesFromAlnScreener, getLatestAlnScreener, getNonAlnChallenges } from './index'
import dateComparator from '../dateComparator'
import enumComparator from '../enumComparator'
import SupportStrategyType from '../../enums/supportStrategyType'

export type GroupedChallengesAndSupport = Record<
  string,
  {
    nonAlnChallenges: Array<ChallengeResponseDto>
    latestAlnScreener: {
      screenerDate: Date
      createdAtPrison: string
      challenges: Array<ChallengeResponseDto>
    }
    supportStrategies: Array<SupportStrategyResponseDto>
  }
>

const toGroupedChallengesAndSupportPromise = (config: {
  challenges: Result<Array<ChallengeResponseDto>>
  alnScreeners: Result<AlnScreenerList>
  supportStrategies: Result<Array<SupportStrategyResponseDto>>
  active: boolean
}): Result<GroupedChallengesAndSupport, Error> => {
  const { challenges, alnScreeners, supportStrategies, active } = config

  if (alnScreeners.isFulfilled() && challenges.isFulfilled() && supportStrategies.isFulfilled()) {
    const groupedChallengesAndSupport: GroupedChallengesAndSupport = {}

    processChallengesIntoGroupedChallengesAndSupport(groupedChallengesAndSupport, challenges, alnScreeners, active)
    processSupportStrategiesIntoGroupedChallengesAndSupport(groupedChallengesAndSupport, supportStrategies, active)

    // Finally we need to reduce into a new object in order to get the object keys sorted by category (with GENERAL always as the last), otherwise the order of the keys will be the order in which they were processed/added to the object
    const groupedChallengesSortedByCategory = Object.keys(groupedChallengesAndSupport)
      .toSorted((categoryA, categoryB) => {
        if (categoryA === 'GENERAL') return 1
        if (categoryB === 'GENERAL') return -1
        return categoryA.localeCompare(categoryB)
      })
      .reduce((acc, category) => {
        acc[category] = groupedChallengesAndSupport[category]
        return acc
      }, {} as GroupedChallengesAndSupport)
    return Result.fulfilled(groupedChallengesSortedByCategory)
  }

  // At least one of the API calls has failed; we need data from all APIs in order to properly render the Challenges & Support page
  // Return a rejected Result containing the error message(s) from the original rejected promise(s)
  return Result.rewrapRejected(alnScreeners, challenges, supportStrategies)
}

// Group and sort the data from the prisoner's non-ALN Challenges, and the Challenges from their latest ALN Screener
const processChallengesIntoGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  challenges: Result<Array<ChallengeResponseDto>>,
  alnScreeners: Result<AlnScreenerList>,
  active: boolean,
) => {
  const nonAlnChallenges = getNonAlnChallenges(challenges, active).toSorted((left, right) =>
    dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
  )
  const latestAlnScreener = getLatestAlnScreener(alnScreeners)
  const challengesFromLatestAlnScreener = getChallengesFromAlnScreener(latestAlnScreener, active).toSorted(
    (left, right) => enumComparator(left.challengeTypeCode, right.challengeTypeCode),
  )
  const screenerDate = latestAlnScreener?.screenerDate
  const prisonScreenerConductedAt = latestAlnScreener?.createdAtPrison

  addNonAlnChallengesToGroupedChallengesAndSupport(groupedChallengesAndSupport, nonAlnChallenges)
  addAlnChallengesToGroupedChallengesAndSupport(
    groupedChallengesAndSupport,
    challengesFromLatestAlnScreener,
    screenerDate,
    prisonScreenerConductedAt,
  )
}

const addNonAlnChallengesToGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  nonAlnChallenges: Array<ChallengeResponseDto>,
) => {
  nonAlnChallenges.reduce((acc, challenge) => {
    const category = challenge.challengeCategory
    const currentEntry = acc[category] ?? {
      nonAlnChallenges: [],
      latestAlnScreener: null,
      supportStrategies: [],
    }
    currentEntry.nonAlnChallenges.push({
      ...challenge,
      howIdentified: challenge.howIdentified?.toSorted(enumComparator),
    })
    acc[category] = currentEntry
    return acc
  }, groupedChallengesAndSupport)
}

const addAlnChallengesToGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  alnChallenges: Array<ChallengeResponseDto>,
  screenerDate: Date,
  createdAtPrison: string,
) => {
  alnChallenges.reduce((acc, challenge) => {
    const category = challenge.challengeCategory
    const currentEntry = acc[category] ?? {
      nonAlnChallenges: [],
      latestAlnScreener: null,
      supportStrategies: [],
    }
    currentEntry.latestAlnScreener = currentEntry.latestAlnScreener || { screenerDate, createdAtPrison, challenges: [] }
    currentEntry.latestAlnScreener.challenges.push(challenge)
    acc[category] = currentEntry
    return acc
  }, groupedChallengesAndSupport)
}

const processSupportStrategiesIntoGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  supportStrategies: Result<Array<SupportStrategyResponseDto>>,
  active: boolean,
) => {
  const supportStrategiesSortedByDate = (
    supportStrategies.getOrNull()?.filter(supportStrategy => supportStrategy.active === active) ?? []
  ).toSorted((left: SupportStrategyResponseDto, right: SupportStrategyResponseDto) =>
    dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
  )
  supportStrategiesSortedByDate.reduce((acc, supportStrategy) => {
    const category =
      supportStrategy.supportStrategyTypeCode === SupportStrategyType.GENERAL
        ? supportStrategy.supportStrategyTypeCode
        : supportStrategy.supportStrategyCategory
    const currentEntry = acc[category] ?? {
      nonAlnChallenges: [],
      latestAlnScreener: null,
      supportStrategies: [],
    }
    currentEntry.supportStrategies.push(supportStrategy)
    acc[category] = currentEntry
    return acc
  }, groupedChallengesAndSupport)
}

export default toGroupedChallengesAndSupportPromise
