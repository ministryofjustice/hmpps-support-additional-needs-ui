import type { AlnScreenerList, AlnScreenerResponseDto, ChallengeResponseDto } from 'dto'
import { Result } from '../../utils/result/result'
import dateComparator from '../dateComparator'

const getNonAlnActiveChallenges = (challenges: Result<Array<ChallengeResponseDto>>): Array<ChallengeResponseDto> =>
  challenges.getOrNull()?.filter(challenge => challenge.active && !challenge.fromALNScreener) ?? []

const getLatestAlnScreener = (screeners: Result<AlnScreenerList>): AlnScreenerResponseDto =>
  screeners
    .getOrNull()
    .screeners.sort((left: AlnScreenerResponseDto, right: AlnScreenerResponseDto) =>
      dateComparator(left.screenerDate, right.screenerDate, 'DESC'),
    )[0]

const getActiveChallengesFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<ChallengeResponseDto> =>
  alnScreener?.challenges.filter(challenge => challenge.active && challenge.fromALNScreener) ?? []

export { getLatestAlnScreener, getActiveChallengesFromAlnScreener, getNonAlnActiveChallenges }
