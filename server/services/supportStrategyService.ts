import type { SupportStrategyDto, SupportStrategyResponseDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateSupportStrategiesRequest } from '../data/mappers/createSupportStrategiesRequestMapper'
import logger from '../../logger'
import {
  toSupportStrategyResponseDto,
  toSupportStrategyResponseDtos,
} from '../data/mappers/supportStrategyResponseDtoMapper'
import toUpdateSupportStrategyRequest from '../data/mappers/updateSupportStrategyRequestMapper'
import toArchiveSupportStrategyRequest from '../data/mappers/archiveSupportStrategyRequestMapper'

export default class SupportStrategyService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async createSupportStrategies(username: string, supportStrategies: Array<SupportStrategyDto>): Promise<void> {
    const [firstSupportStrategy] = supportStrategies
    const { prisonNumber } = firstSupportStrategy
    try {
      const createSupportStrategiesRequest = toCreateSupportStrategiesRequest(supportStrategies)
      await this.supportAdditionalNeedsApiClient.createSupportStrategies(
        prisonNumber,
        username,
        createSupportStrategiesRequest,
      )
    } catch (e) {
      logger.error(`Error creating Support Strategies for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getSupportStrategies(username: string, prisonNumber: string): Promise<Array<SupportStrategyResponseDto>> {
    try {
      const supportStrategyListResponse = await this.supportAdditionalNeedsApiClient.getSupportStrategies(
        prisonNumber,
        username,
      )
      return toSupportStrategyResponseDtos(supportStrategyListResponse, prisonNumber)
    } catch (e) {
      logger.error(`Error retrieving Support Strategies for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getSupportStrategy(
    username: string,
    prisonNumber: string,
    supportStrategyReference: string,
  ): Promise<SupportStrategyResponseDto> {
    try {
      const supportStrategyResponse = await this.supportAdditionalNeedsApiClient.getSupportStrategy(
        prisonNumber,
        supportStrategyReference,
        username,
      )
      return toSupportStrategyResponseDto(prisonNumber, supportStrategyResponse)
    } catch (e) {
      logger.error(`Error getting Support Strategy for [${prisonNumber}]`, e)
      throw e
    }
  }

  async updateSupportStrategy(
    username: string,
    supportStrategyReference: string,
    supportStrategy: SupportStrategyDto,
  ): Promise<void> {
    const { prisonNumber } = supportStrategy
    try {
      const updateSupportStrategyRequest = toUpdateSupportStrategyRequest(supportStrategy)
      await this.supportAdditionalNeedsApiClient.updateSupportStrategy(
        prisonNumber,
        supportStrategyReference,
        username,
        updateSupportStrategyRequest,
      )
    } catch (e) {
      logger.error(`Error updating Support Strategy for [${prisonNumber}]`, e)
      throw e
    }
  }

  async archiveSupportStrategy(
    username: string,
    supportStrategyReference: string,
    supportStrategy: SupportStrategyDto,
  ): Promise<void> {
    const { prisonNumber } = supportStrategy
    try {
      const archiveSupportStrategyRequest = toArchiveSupportStrategyRequest(supportStrategy)
      await this.supportAdditionalNeedsApiClient.archiveSupportStrategy(
        prisonNumber,
        supportStrategyReference,
        username,
        archiveSupportStrategyRequest,
      )
    } catch (e) {
      logger.error(`Error archiving Support Strategy for [${prisonNumber}]`, e)
      throw e
    }
  }
}
