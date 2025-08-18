import type { SupportStrategyDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateSupportStrategiesRequest } from '../data/mappers/createSupportStrategiesRequestMapper'
import logger from '../../logger'

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
}
