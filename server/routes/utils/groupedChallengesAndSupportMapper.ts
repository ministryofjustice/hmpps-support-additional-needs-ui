import type { AlnScreenerList, ChallengeResponseDto, SupportStrategyResponseDto } from 'dto'
import { Result } from '../../utils/result/result'
import { getChallengesFromAlnScreener, getLatestAlnScreener, getNonAlnChallenges } from './index'
import dateComparator from '../dateComparator'
import enumComparator from '../enumComparator'
import SupportStrategyType from '../../enums/supportStrategyType'

type ChallengesAndSupportGroupedByCategory = Record<
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
export type GroupedChallengesAndSupport = {
  dataGroupedByCategory: ChallengesAndSupportGroupedByCategory
  summary: {
    supportStrategiesCount: number
    challengesCount: number
    categoryCount: number
  }
}

const toGroupedChallengesAndSupportPromise = (config: {
  challenges: Result<Array<ChallengeResponseDto>>
  alnScreeners: Result<AlnScreenerList>
  supportStrategies: Result<Array<SupportStrategyResponseDto>>
  active: boolean
}): Result<GroupedChallengesAndSupport, Error> => {
  const { challenges, alnScreeners, supportStrategies, active } = config

  if (alnScreeners.isFulfilled() && challenges.isFulfilled() && supportStrategies.isFulfilled()) {
    let groupedChallengesAndSupport: GroupedChallengesAndSupport = {
      dataGroupedByCategory: {},
      summary: { supportStrategiesCount: 0, challengesCount: 0, categoryCount: 0 },
    }

    groupedChallengesAndSupport = processChallengesIntoGroupedChallengesAndSupport(
      groupedChallengesAndSupport,
      challenges,
      alnScreeners,
      active,
    )
    groupedChallengesAndSupport = processSupportStrategiesIntoGroupedChallengesAndSupport(
      groupedChallengesAndSupport,
      supportStrategies,
      active,
    )

    groupedChallengesAndSupport.summary.categoryCount = Object.keys(
      groupedChallengesAndSupport.dataGroupedByCategory,
    ).length

    // Finally we need to reduce into a new object in order to get the object keys sorted by category (with GENERAL always as the last), otherwise the order of the keys will be the order in which they were processed/added to the object
    groupedChallengesAndSupport.dataGroupedByCategory = Object.keys(groupedChallengesAndSupport.dataGroupedByCategory)
      .toSorted((categoryA, categoryB) => {
        if (categoryA === 'GENERAL') return 1
        if (categoryB === 'GENERAL') return -1
        return categoryA.localeCompare(categoryB)
      })
      .reduce((acc, category) => {
        acc[category] = groupedChallengesAndSupport.dataGroupedByCategory[category]
        return acc
      }, {} as ChallengesAndSupportGroupedByCategory)
    return Result.fulfilled(groupedChallengesAndSupport)
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
): GroupedChallengesAndSupport => {
  const nonAlnChallenges = getNonAlnChallenges(challenges, active).toSorted((left, right) =>
    dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
  )
  const latestAlnScreener = getLatestAlnScreener(alnScreeners)
  const challengesFromLatestAlnScreener = getChallengesFromAlnScreener(latestAlnScreener, active).toSorted(
    (left, right) => enumComparator(left.challengeTypeCode, right.challengeTypeCode),
  )
  const screenerDate = latestAlnScreener?.screenerDate
  const prisonScreenerConductedAt = latestAlnScreener?.createdAtPrison

  return addAlnChallengesToGroupedChallengesAndSupport(
    addNonAlnChallengesToGroupedChallengesAndSupport(groupedChallengesAndSupport, nonAlnChallenges),
    challengesFromLatestAlnScreener,
    screenerDate,
    prisonScreenerConductedAt,
  )
}

const addNonAlnChallengesToGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  nonAlnChallenges: Array<ChallengeResponseDto>,
): GroupedChallengesAndSupport => {
  const dataGroupedByCategory = nonAlnChallenges.reduce(
    (acc, challenge) => {
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
    },
    { ...groupedChallengesAndSupport.dataGroupedByCategory },
  )

  return {
    dataGroupedByCategory,
    summary: {
      ...groupedChallengesAndSupport.summary,
      challengesCount: groupedChallengesAndSupport.summary.challengesCount + nonAlnChallenges.length,
    },
  }
}

const addAlnChallengesToGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  alnChallenges: Array<ChallengeResponseDto>,
  screenerDate: Date,
  createdAtPrison: string,
): GroupedChallengesAndSupport => {
  const dataGroupedByCategory = alnChallenges.reduce(
    (acc, challenge) => {
      const category = challenge.challengeCategory
      const currentEntry = acc[category] ?? {
        nonAlnChallenges: [],
        latestAlnScreener: null,
        supportStrategies: [],
      }
      currentEntry.latestAlnScreener = currentEntry.latestAlnScreener || {
        screenerDate,
        createdAtPrison,
        challenges: [],
      }
      currentEntry.latestAlnScreener.challenges.push(challenge)
      acc[category] = currentEntry
      return acc
    },
    { ...groupedChallengesAndSupport.dataGroupedByCategory },
  )

  return {
    dataGroupedByCategory,
    summary: {
      ...groupedChallengesAndSupport.summary,
      challengesCount: groupedChallengesAndSupport.summary.challengesCount + alnChallenges.length,
    },
  }
}

const processSupportStrategiesIntoGroupedChallengesAndSupport = (
  groupedChallengesAndSupport: GroupedChallengesAndSupport,
  supportStrategies: Result<Array<SupportStrategyResponseDto>>,
  active: boolean,
): GroupedChallengesAndSupport => {
  const supportStrategiesSortedByDate = (
    supportStrategies.getOrNull()?.filter(supportStrategy => supportStrategy.active === active) ?? []
  ).toSorted((left: SupportStrategyResponseDto, right: SupportStrategyResponseDto) =>
    dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
  )
  const dataGroupedByCategory = supportStrategiesSortedByDate.reduce(
    (acc, supportStrategy) => {
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
    },
    { ...groupedChallengesAndSupport.dataGroupedByCategory },
  )

  return {
    dataGroupedByCategory,
    summary: {
      ...groupedChallengesAndSupport.summary,
      supportStrategiesCount: supportStrategiesSortedByDate.length,
    },
  }
}

export default toGroupedChallengesAndSupportPromise
