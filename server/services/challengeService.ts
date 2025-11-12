import type { ChallengeDto, ChallengeResponseDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateChallengesRequest } from '../data/mappers/createChallengesRequestMapper'
import logger from '../../logger'
import { toChallengeDto, toChallengeResponseDto } from '../data/mappers/challengeDtoMapper'
import toUpdateChallengeRequest from '../data/mappers/updateChallengeRequestMapper'
import toArchiveChallengeRequest from '../data/mappers/archiveChallengeRequestMapper'

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
      const challengeResponse = await this.supportAdditionalNeedsApiClient.getChallenge(
        prisonNumber,
        challengeReference,
        username,
      )
      return toChallengeResponseDto(prisonNumber, challengeResponse)
    } catch (e) {
      logger.error(`Error getting Challenge for [${prisonNumber}]`, e)
      throw e
    }
  }

  async updateChallenge(username: string, challengeReference: string, challenge: ChallengeDto): Promise<void> {
    const { prisonNumber } = challenge
    try {
      const updateChallengeRequest = toUpdateChallengeRequest(challenge)
      await this.supportAdditionalNeedsApiClient.updateChallenge(
        prisonNumber,
        challengeReference,
        username,
        updateChallengeRequest,
      )
    } catch (e) {
      logger.error(`Error updating Challenge for [${prisonNumber}]`, e)
      throw e
    }
  }

  async archiveChallenge(username: string, challengeReference: string, challenge: ChallengeDto): Promise<void> {
    const { prisonNumber } = challenge
    try {
      const archiveChallengeRequest = toArchiveChallengeRequest(challenge)
      await this.supportAdditionalNeedsApiClient.archiveChallenge(
        prisonNumber,
        challengeReference,
        username,
        archiveChallengeRequest,
      )
    } catch (e) {
      logger.error(`Error archiving Challenge for [${prisonNumber}]`, e)
      throw e
    }
  }
}
