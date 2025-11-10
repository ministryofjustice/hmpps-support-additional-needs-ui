import type {
  AlnScreenerList,
  AlnScreenerResponseDto,
  ChallengeResponseDto,
  StrengthResponseDto,
  StrengthsList,
} from 'dto'
import { Result } from '../../utils/result/result'
import dateComparator from '../dateComparator'

const getLatestAlnScreener = (screeners: Result<AlnScreenerList>): AlnScreenerResponseDto =>
  screeners
    .getOrNull()
    .screeners.sort((left: AlnScreenerResponseDto, right: AlnScreenerResponseDto) =>
      dateComparator(left.screenerDate, right.screenerDate, 'DESC'),
    )[0]

/**
 * Returns an array of non-ALN Strength Response DTO from the specified list of Strengths, where the strength's active
 * flag is set according to the method argument.
 */
const getNonAlnStrengths = (strengths: Result<StrengthsList>, active: boolean): Array<StrengthResponseDto> =>
  strengths.getOrNull()?.strengths.filter(strength => strength.active === active && !strength.fromALNScreener) ?? []

/**
 * Returns an array of ALN Strength Response DTO from the specified ALN Screener Response DTO, where the strength's active
 * flag is set according to the method argument.
 */
const getStrengthsFromAlnScreener = (
  alnScreener: AlnScreenerResponseDto,
  active: boolean,
): Array<StrengthResponseDto> =>
  alnScreener?.strengths.filter(strength => strength.active === active && strength.fromALNScreener) ?? []

/**
 * Returns an array of non-ALN Challenge Response DTO from the specified list of Challenges, where the challenge's active
 * flag is set according to the method argument.
 */
const getNonAlnChallenges = (
  challenges: Result<Array<ChallengeResponseDto>>,
  active: boolean,
): Array<ChallengeResponseDto> =>
  challenges.getOrNull()?.filter(challenge => challenge.active === active && !challenge.fromALNScreener) ?? []

/**
 * Returns an array of ALN Challenge Response DTO from the specified ALN Screener Response DTO, where the challenge's active
 * flag is set according to the method argument.
 */
const getChallengesFromAlnScreener = (
  alnScreener: AlnScreenerResponseDto,
  active: boolean,
): Array<ChallengeResponseDto> =>
  alnScreener?.challenges.filter(challenge => challenge.active === active && challenge.fromALNScreener) ?? []

export {
  getLatestAlnScreener,
  getNonAlnStrengths,
  getStrengthsFromAlnScreener,
  getNonAlnChallenges,
  getChallengesFromAlnScreener,
}
