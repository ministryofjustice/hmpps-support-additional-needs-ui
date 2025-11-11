import type { StrengthDto, StrengthResponseDto, StrengthsList } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateStrengthsRequest } from '../data/mappers/createStrengthsRequestMapper'
import logger from '../../logger'
import { toStrengthsList, toStrengthResponseDto } from '../data/mappers/strengthResponseDtoMapper'
import toUpdateStrengthRequest from '../data/mappers/updateStrengthRequestMapper'
import toArchiveStrengthRequest from '../data/mappers/archiveStrengthRequestMapper'

export default class StrengthService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async createStrengths(username: string, strengths: Array<StrengthDto>): Promise<void> {
    const [firstStrength] = strengths
    const { prisonNumber } = firstStrength
    try {
      const createStrengthsRequest = toCreateStrengthsRequest(strengths)
      await this.supportAdditionalNeedsApiClient.createStrengths(prisonNumber, username, createStrengthsRequest)
    } catch (e) {
      logger.error(`Error creating Strengths for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getStrengths(username: string, prisonNumber: string): Promise<StrengthsList> {
    try {
      const strengthListResponse = await this.supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username)
      return toStrengthsList(strengthListResponse, prisonNumber)
    } catch (e) {
      logger.error(`Error getting Strengths for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getStrength(username: string, prisonNumber: string, strengthReference: string): Promise<StrengthResponseDto> {
    try {
      const strengthResponse = await this.supportAdditionalNeedsApiClient.getStrength(
        prisonNumber,
        strengthReference,
        username,
      )
      return toStrengthResponseDto(prisonNumber, strengthResponse)
    } catch (e) {
      logger.error(`Error getting Strength for [${prisonNumber}]`, e)
      throw e
    }
  }

  async updateStrength(username: string, strengthReference: string, strength: StrengthDto): Promise<void> {
    const { prisonNumber } = strength
    try {
      const updateStrengthRequest = toUpdateStrengthRequest(strength)
      await this.supportAdditionalNeedsApiClient.updateStrength(
        prisonNumber,
        strengthReference,
        username,
        updateStrengthRequest,
      )
    } catch (e) {
      logger.error(`Error updating Strength for [${prisonNumber}]`, e)
      throw e
    }
  }

  async archiveStrength(username: string, strengthReference: string, strength: StrengthDto): Promise<void> {
    const { prisonNumber } = strength
    try {
      const archiveStrengthRequest = toArchiveStrengthRequest(strength)
      await this.supportAdditionalNeedsApiClient.archiveStrength(
        prisonNumber,
        strengthReference,
        username,
        archiveStrengthRequest,
      )
    } catch (e) {
      logger.error(`Error archiving Strength for [${prisonNumber}]`, e)
      throw e
    }
  }
}
