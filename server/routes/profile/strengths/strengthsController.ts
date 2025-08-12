import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AlnScreenerList, AlnScreenerResponseDto, StrengthResponseDto, StrengthsList } from 'dto'
import dateComparator from '../../dateComparator'
import { Result } from '../../../utils/result/result'

export type GroupedStrengths = Record<
  string,
  {
    nonAlnStrengths: Array<StrengthResponseDto>
    latestAlnScreener: {
      screenerDate: Date
      strengths: Array<StrengthResponseDto>
    }
  }
>

export default class StrengthsController {
  getStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, prisonerSummary, strengths } = res.locals

    let groupedStrengthsPromise: Result<GroupedStrengths, Error>
    if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
      // Group and sort the data from the prisoner's non-ALN Strengths, and the Strengths from their latest ALN Screener
      const nonAlnStrengths = getNonAlnActiveStrengths(strengths)
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const strengthsFromLatestAlnScreener = getActiveStrengthsFromAlnScreener(latestAlnScreener)
      const screenerDate = latestAlnScreener?.screenerDate

      const groupedStrengths: GroupedStrengths = {}
      addNonAlnStrengthsToGroupedStrengths(groupedStrengths, nonAlnStrengths, screenerDate)
      addAlnStrengthsToGroupedStrengths(groupedStrengths, strengthsFromLatestAlnScreener, screenerDate)
      groupedStrengthsPromise = Result.fulfilled(groupedStrengths)
    } else {
      // At least one of the API calls has failed; we need data from both APIs in order to properly render the Strengths page
      // Set the groupedStrengths to be a rejected Result containing the error message(s) from the original rejected promise(s)
      groupedStrengthsPromise = reWrapRejectedPromises(alnScreeners, strengths)
    }

    const viewRenderArgs = {
      prisonerSummary,
      alnScreeners, // TODO remove when the view uses the new groupedStrengths property
      strengths, // TODO remove when the view uses the new groupedStrengths property
      groupedStrengths: groupedStrengthsPromise,
      tab: 'strengths',
    }
    return res.render('pages/profile/strengths/index', viewRenderArgs)
  }
}

const addNonAlnStrengthsToGroupedStrengths = (
  groupedStrengths: GroupedStrengths,
  nonAlnStrengths: Array<StrengthResponseDto>,
  screenerDate: Date,
) => {
  nonAlnStrengths.reduce((acc, strength) => {
    const category = strength.strengthCategory
    const currentEntry = acc[category] ?? { nonAlnStrengths: [], latestAlnScreener: { screenerDate, strengths: [] } }
    currentEntry.nonAlnStrengths.push(strength)
    acc[category] = currentEntry
    return acc
  }, groupedStrengths)
}

const addAlnStrengthsToGroupedStrengths = (
  groupedStrengths: GroupedStrengths,
  alnStrengths: Array<StrengthResponseDto>,
  screenerDate: Date,
) => {
  alnStrengths.reduce((acc, strength) => {
    const category = strength.strengthCategory
    const currentEntry = acc[category] ?? { nonAlnStrengths: [], latestAlnScreener: { screenerDate, strengths: [] } }
    currentEntry.latestAlnScreener = currentEntry.latestAlnScreener || { screenerDate, strengths: [] }
    currentEntry.latestAlnScreener.strengths.push(strength)
    acc[category] = currentEntry
    return acc
  }, groupedStrengths)
}

const getNonAlnActiveStrengths = (strengths: Result<StrengthsList>): Array<StrengthResponseDto> =>
  strengths.getOrNull()?.strengths.filter(strength => strength.active && !strength.fromALNScreener) ?? []

const getLatestAlnScreener = (screeners: Result<AlnScreenerList>): AlnScreenerResponseDto =>
  screeners
    .getOrNull()
    .screeners.sort((left: AlnScreenerResponseDto, right: AlnScreenerResponseDto) =>
      dateComparator(left.screenerDate, right.screenerDate, 'DESC'),
    )[0]

const getActiveStrengthsFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<StrengthResponseDto> =>
  alnScreener?.strengths.filter(strength => strength.active && strength.fromALNScreener) ?? []

const reWrapRejectedPromises = (
  alnScreeners: Result<AlnScreenerList>,
  strengths: Result<StrengthsList>,
): Result<GroupedStrengths> => {
  const apiErrorMessages = [alnScreeners, strengths]
    .map(result => (!result.isFulfilled() ? result : null))
    .filter(result => result != null)
    .map(result => result.getOrHandle(error => error.message))
    .join(', ')
  return Result.rejected(new Error(apiErrorMessages))
}
