import type { AdditionalNeedsFactorsDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import toAdditionalNeedsFactorsDto from '../data/mappers/additionalNeedsFactorsDtoMapper'
import logger from '../../logger'

export default class AdditionalNeedsService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async getAdditionalNeedFactors(username: string, prisonNumber: string): Promise<AdditionalNeedsFactorsDto> {
    try {
      const additionalNeedsFactors = await this.supportAdditionalNeedsApiClient.getAdditionalNeedsFactors(
        prisonNumber,
        username,
      )
      return toAdditionalNeedsFactorsDto(prisonNumber, additionalNeedsFactors)
    } catch (e) {
      logger.error(`Error getting Additional Needs Factors for [${prisonNumber}]`, e)
      throw e
    }
  }
}
