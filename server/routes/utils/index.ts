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

const getNonAlnActiveStrengths = (strengths: Result<StrengthsList>): Array<StrengthResponseDto> =>
  strengths.getOrNull()?.strengths.filter(strength => strength.active && !strength.fromALNScreener) ?? []

const getActiveStrengthsFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<StrengthResponseDto> =>
  alnScreener?.strengths.filter(strength => strength.active && strength.fromALNScreener) ?? []

const getNonAlnActiveChallenges = (challenges: Result<Array<ChallengeResponseDto>>): Array<ChallengeResponseDto> =>
  challenges.getOrNull()?.filter(challenge => challenge.active && !challenge.fromALNScreener) ?? []

const getActiveChallengesFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<ChallengeResponseDto> =>
  alnScreener?.challenges.filter(challenge => challenge.active && challenge.fromALNScreener) ?? []

export {
  getLatestAlnScreener,
  getNonAlnActiveStrengths,
  getActiveStrengthsFromAlnScreener,
  getNonAlnActiveChallenges,
  getActiveChallengesFromAlnScreener,
}
