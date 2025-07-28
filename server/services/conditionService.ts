import type { ConditionsList } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateConditionsRequest } from '../data/mappers/createConditionsRequestMapper'
import logger from '../../logger'

export default class ConditionService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async createConditions(username: string, conditions: ConditionsList): Promise<void> {
    const { prisonNumber } = conditions
    try {
      const createConditionsRequest = toCreateConditionsRequest(conditions)
      await this.supportAdditionalNeedsApiClient.createConditions(prisonNumber, username, createConditionsRequest)
    } catch (e) {
      logger.error(`Error creating Conditions for [${prisonNumber}]`, e)
      throw e
    }
  }
}
