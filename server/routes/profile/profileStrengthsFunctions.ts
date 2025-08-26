import type {
  AlnScreenerList,
  AlnScreenerResponseDto,
  ChallengeResponseDto,
  StrengthResponseDto,
  StrengthsList,
} from 'dto'
import { Result } from '../../utils/result/result'
import dateComparator from '../dateComparator'

const getNonAlnActiveStrengths = (strengths: Result<StrengthsList>): Array<StrengthResponseDto> =>
  strengths.getOrNull()?.strengths.filter(strength => strength.active && !strength.fromALNScreener) ?? []

const getNonAlnActiveChallenges = (challenges: Result<Array<ChallengeResponseDto>>): Array<ChallengeResponseDto> =>
  challenges.getOrNull()?.filter(challenge => challenge.active && !challenge.fromALNScreener) ?? []

const getLatestAlnScreener = (screeners: Result<AlnScreenerList>): AlnScreenerResponseDto =>
  screeners
    .getOrNull()
    .screeners.sort((left: AlnScreenerResponseDto, right: AlnScreenerResponseDto) =>
      dateComparator(left.screenerDate, right.screenerDate, 'DESC'),
    )[0]

const getActiveStrengthsFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<StrengthResponseDto> =>
  alnScreener?.strengths.filter(strength => strength.active && strength.fromALNScreener) ?? []

const getActiveChallengesFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<ChallengeResponseDto> =>
  alnScreener?.challenges.filter(challenge => challenge.active && challenge.fromALNScreener) ?? []

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

export {
  getNonAlnActiveStrengths,
  getLatestAlnScreener,
  getActiveStrengthsFromAlnScreener,
  reWrapRejectedPromises,
  getActiveChallengesFromAlnScreener,
  getNonAlnActiveChallenges,
}
