import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { StrengthResponseDto } from 'dto'
import dateComparator from '../../dateComparator'
import enumComparator from '../../enumComparator'
import { Result } from '../../../utils/result/result'
import {
  getActiveStrengthsFromAlnScreener,
  getLatestAlnScreener,
  getNonAlnActiveStrengths,
} from '../profileStrengthsFunctions'

export type GroupedStrengths = Record<
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

export default class StrengthsController {
  getStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, educationSupportPlanLifecycleStatus, prisonerSummary, prisonNamesById, strengths } =
      res.locals

    let groupedStrengthsPromise: Result<GroupedStrengths, Error>
    if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
      // Group and sort the data from the prisoner's non-ALN Strengths, and the Strengths from their latest ALN Screener
      const nonAlnStrengths = getNonAlnActiveStrengths(strengths).sort((left, right) =>
        dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
      )
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const strengthsFromLatestAlnScreener = getActiveStrengthsFromAlnScreener(latestAlnScreener).sort((left, right) =>
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
      groupedStrengthsPromise = Result.fulfilled(groupedStrengthsSortedByCategory)
    } else {
      // At least one of the API calls has failed; we need data from both APIs in order to properly render the Strengths page
      // Set the groupedStrengths to be a rejected Result containing the error message(s) from the original rejected promise(s)
      groupedStrengthsPromise = Result.rewrapRejected(alnScreeners, strengths)
    }

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
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
