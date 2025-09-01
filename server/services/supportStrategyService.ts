import type { SupportStrategyDto, SupportStrategyResponseDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateSupportStrategiesRequest } from '../data/mappers/createSupportStrategiesRequestMapper'
import logger from '../../logger'
import { toSupportStrategyResponseDtos } from '../data/mappers/supportStrategyResponseDtoMapper'

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
      return toSupportStrategyResponseDtos(supportStrategyListResponse)
    } catch (e) {
      logger.error(`Error retrieving Support Strategies for [${prisonNumber}]`, e)
      throw e
    }
  }
}
