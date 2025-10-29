import type { ChallengeDto, ChallengeResponseDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateChallengesRequest } from '../data/mappers/createChallengesRequestMapper'
import logger from '../../logger'
import { toChallengeDto, toChallengeResponseDto } from '../data/mappers/challengeDtoMapper'

export default class ChallengeService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async createChallenges(username: string, challenges: Array<ChallengeDto>): Promise<void> {
    const [firstChallenge] = challenges
    const { prisonNumber } = firstChallenge
    try {
      const createChallengesRequest = toCreateChallengesRequest(challenges)
      await this.supportAdditionalNeedsApiClient.createChallenges(prisonNumber, username, createChallengesRequest)
    } catch (e) {
      logger.error(`Error creating Challenges for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getChallenges(username: string, prisonNumber: string): Promise<Array<ChallengeResponseDto>> {
    try {
      const challengeListResponse = await this.supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username)
      return toChallengeDto(prisonNumber, challengeListResponse)
    } catch (e) {
      logger.error(`Error getting Challenges for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getChallenge(
    username: string,
    prisonNumber: string,
    challengeReference: string,
  ): Promise<ChallengeResponseDto> {
    try {
      const challengeListResponse = await this.supportAdditionalNeedsApiClient.getChallenge(
        prisonNumber,
        challengeReference,
        username,
      )
      return toChallengeResponseDto(prisonNumber, challengeListResponse)
    } catch (e) {
      logger.error(`Error getting Challenge for [${prisonNumber}]`, e)
      throw e
    }
  }
}
