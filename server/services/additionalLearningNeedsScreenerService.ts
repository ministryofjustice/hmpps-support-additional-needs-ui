import type { AlnScreenerDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import logger from '../../logger'
import toAlnScreenerRequest from '../data/mappers/alnScreenerRequestMapper'

export default class AdditionalLearningNeedsScreenerService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async recordAlnScreener(username: string, alnScreenerDto: AlnScreenerDto): Promise<void> {
    const { prisonNumber } = alnScreenerDto
    try {
      const alnScreenerRequest = toAlnScreenerRequest(alnScreenerDto)
      await this.supportAdditionalNeedsApiClient.createAdditionalLearningNeedsScreener(
        prisonNumber,
        username,
        alnScreenerRequest,
      )
    } catch (e) {
      logger.error(`Error recording ALN Screener for [${prisonNumber}]`, e)
      throw e
    }
  }
}
