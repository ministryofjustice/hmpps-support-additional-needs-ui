import type { AlnScreenerList, StrengthResponseDto, StrengthsList } from 'dto'
import enumComparator from '../enumComparator'
import { Result } from '../../utils/result/result'
import { getStrengthsFromAlnScreener, getLatestAlnScreener, getNonAlnStrengths } from './index'
import dateComparator from '../dateComparator'

type GroupedStrengths = Record<
  string,
  {
    nonAlnStrengths: Array<StrengthResponseDto>
    latestAlnScreener: {
      screenerDate: Date
      createdAtPrison: string
      strengths: Array<StrengthResponseDto>
    }
  }
>

const toGroupedStrengthsPromise = (config: {
  strengths: Result<StrengthsList>
  alnScreeners: Result<AlnScreenerList>
  active: boolean
}): Result<GroupedStrengths, Error> => {
  const { strengths, alnScreeners, active } = config
  if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
    // Group and sort the data from the prisoner's non-ALN Strengths, and the Strengths from their latest ALN Screener
    const nonAlnStrengths = getNonAlnStrengths(strengths, active).sort((left, right) =>
      dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
    )
    const latestAlnScreener = getLatestAlnScreener(alnScreeners)
    const strengthsFromLatestAlnScreener = getStrengthsFromAlnScreener(latestAlnScreener, active).sort((left, right) =>
      enumComparator(left.strengthTypeCode, right.strengthTypeCode),
    )
    const screenerDate = latestAlnScreener?.screenerDate
    const prisonScreenerConductedAt = latestAlnScreener?.createdAtPrison

    const groupedStrengths: GroupedStrengths = {}
    addNonAlnStrengthsToGroupedStrengths(groupedStrengths, nonAlnStrengths, screenerDate, prisonScreenerConductedAt)
    addAlnStrengthsToGroupedStrengths(
      groupedStrengths,
      strengthsFromLatestAlnScreener,
      screenerDate,
      prisonScreenerConductedAt,
    )

    const groupedStrengthsSortedByCategory = Object.keys(groupedStrengths)
      .sort(enumComparator)
      .reduce((acc, category) => {
        acc[category] = groupedStrengths[category]
        return acc
      }, {} as GroupedStrengths)
    return Result.fulfilled(groupedStrengthsSortedByCategory)
  }

  // At least one of the API calls has failed; we need data from both APIs in order to properly render the Strengths page
  // Return a rejected Result containing the error message(s) from the original rejected promise(s)
  return Result.rewrapRejected(alnScreeners, strengths)
}

const addNonAlnStrengthsToGroupedStrengths = (
  groupedStrengths: GroupedStrengths,
  nonAlnStrengths: Array<StrengthResponseDto>,
  screenerDate: Date,
  createdAtPrison: string,
) => {
  nonAlnStrengths.reduce((acc, strength) => {
    const category = strength.strengthCategory
    const currentEntry = acc[category] ?? {
      nonAlnStrengths: [],
      latestAlnScreener: { screenerDate, createdAtPrison, strengths: [] },
    }
    currentEntry.nonAlnStrengths.push({
      ...strength,
      howIdentified: strength.howIdentified?.sort(enumComparator),
    })
    acc[category] = currentEntry
    return acc
  }, groupedStrengths)
}

const addAlnStrengthsToGroupedStrengths = (
  groupedStrengths: GroupedStrengths,
  alnStrengths: Array<StrengthResponseDto>,
  screenerDate: Date,
  createdAtPrison: string,
) => {
  alnStrengths.reduce((acc, strength) => {
    const category = strength.strengthCategory
    const currentEntry = acc[category] ?? {
      nonAlnStrengths: [],
      latestAlnScreener: { screenerDate, createdAtPrison, strengths: [] },
    }
    currentEntry.latestAlnScreener = currentEntry.latestAlnScreener || { screenerDate, createdAtPrison, strengths: [] }
    currentEntry.latestAlnScreener.strengths.push(strength)
    acc[category] = currentEntry
    return acc
  }, groupedStrengths)
}

export default toGroupedStrengthsPromise
