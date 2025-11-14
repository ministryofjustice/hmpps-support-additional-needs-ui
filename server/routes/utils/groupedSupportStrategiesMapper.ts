import type { SupportStrategyResponseDto } from 'dto'
import { Result } from '../../utils/result/result'
import SupportStrategyType from '../../enums/supportStrategyType'
import dateComparator from '../dateComparator'

type GroupedSupportStrategies = {
  [key: string]: SupportStrategyResponseDto[]
}

const toGroupedSupportStrategiesPromise = (config: {
  supportStrategies: Result<Array<SupportStrategyResponseDto>>
  active: boolean
}): Result<GroupedSupportStrategies, Error> => {
  const { supportStrategies, active } = config
  if (supportStrategies.isFulfilled()) {
    return Result.fulfilled(groupSupportStrategiesByCategory(supportStrategies, active))
  }

  return Result.rewrapRejected(supportStrategies)
}

const groupSupportStrategiesByCategory = (
  supportStrategies: Result<Array<SupportStrategyResponseDto>>,
  active: boolean,
): GroupedSupportStrategies => {
  const sortedByDate = (
    supportStrategies.getOrNull()?.filter(supportStrategy => supportStrategy.active === active) ?? []
  ).sort((left: SupportStrategyResponseDto, right: SupportStrategyResponseDto) =>
    dateComparator(left.updatedAt, right.updatedAt, 'DESC'),
  )

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

export default toGroupedSupportStrategiesPromise
