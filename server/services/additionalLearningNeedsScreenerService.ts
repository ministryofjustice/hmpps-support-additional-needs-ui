import type { AlnScreenerDto, AlnScreenerList } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import logger from '../../logger'
import toAlnScreenerRequest from '../data/mappers/alnScreenerRequestMapper'
import { toAlnScreenerList } from '../data/mappers/alnScreenerResponseDtoMapper'

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

  async getAlnScreeners(username: string, prisonNumber: string): Promise<AlnScreenerList> {
    try {
      const alnScreeners = await this.supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners(
        prisonNumber,
        username,
      )
      return toAlnScreenerList(alnScreeners, prisonNumber)
    } catch (e) {
      logger.error(`Error getting ALN Screeners for [${prisonNumber}]`, e)
      throw e
    }
  }
}
