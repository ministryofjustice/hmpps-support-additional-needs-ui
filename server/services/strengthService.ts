import type { StrengthDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateStrengthsRequest } from '../data/mappers/createStrengthsRequestMapper'
import logger from '../../logger'

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
}
