import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import { compareDesc } from 'date-fns'
import { Result } from '../../../utils/result/result'
import SupportStrategyType from '../../../enums/supportStrategyType'

export type GroupedSupportStrategies = {
  [key: string]: SupportStrategyResponseDto[]
}

export default class SupportStrategiesController {
  private groupSupportStrategiesByCategory = (strategies: SupportStrategyResponseDto[]): GroupedSupportStrategies => {
    const sortedByDate = [...strategies].sort((a, b) => compareDesc(a.updatedAt, b.updatedAt))

    const sortedByDateAndGrouped = sortedByDate.reduce((grouped, strategy) => {
      const category = strategy.supportStrategyTypeCode
      return {
        ...grouped,
        [category]: [...(grouped[category] || []), strategy],
      }
    }, {} as GroupedSupportStrategies)
    const sortedByDateAndGroupAsc = Object.entries(sortedByDateAndGrouped).sort(([categoryA], [categoryB]) => {
      if (categoryA === SupportStrategyType.GENERAL) return 1
      if (categoryB === SupportStrategyType.GENERAL) return -1
      return categoryA.localeCompare(categoryB)
    })
    return Object.fromEntries(sortedByDateAndGroupAsc)
  }

  getSupportStrategiesView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, supportStrategies, prisonNamesById } = res.locals
    let groupedSupportStrategiesPromise: Result<GroupedSupportStrategies, Error>

    if (supportStrategies.isFulfilled()) {
      const groupedSupportStrategies = this.groupSupportStrategiesByCategory(supportStrategies.value || [])
      groupedSupportStrategiesPromise = Result.fulfilled(groupedSupportStrategies)
    } else {
      groupedSupportStrategiesPromise = Result.rewrapRejected(supportStrategies)
    }

    const viewRenderArgs = {
      prisonerSummary,
      tab: 'support-strategies',
      supportStrategies: groupedSupportStrategiesPromise,
      prisonNamesById,
    }
    return res.render('pages/profile/support-strategies/index', viewRenderArgs)
  }
}
