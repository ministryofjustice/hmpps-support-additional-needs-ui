import type { AlnScreenerList, AlnScreenerResponseDto, StrengthResponseDto, StrengthsList } from 'dto'
import { Result } from '../../utils/result/result'
import dateComparator from '../dateComparator'

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

const reWrapRejectedPromises = <T>(
  alnScreeners: Result<AlnScreenerList>,
  strengths: Result<StrengthsList>,
): Result<T> => {
  const apiErrorMessages = [alnScreeners, strengths]
    .map(result => (!result.isFulfilled() ? result : null))
    .filter(result => result != null)
    .map(result => result.getOrHandle(error => error.message))
    .join(', ')
  return Result.rejected(new Error(apiErrorMessages))
}

export { getNonAlnActiveStrengths, getLatestAlnScreener, getActiveStrengthsFromAlnScreener, reWrapRejectedPromises }
