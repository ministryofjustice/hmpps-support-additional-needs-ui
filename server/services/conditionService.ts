import type { ConditionsList } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateConditionsRequest } from '../data/mappers/createConditionsRequestMapper'
import logger from '../../logger'
import { toConditionsList } from '../data/mappers/conditionDtoMapper'

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

  async getConditions(username: string, prisonNumber: string): Promise<ConditionsList> {
    try {
      const conditionListResponse = await this.supportAdditionalNeedsApiClient.getConditions(prisonNumber, username)
      return conditionListResponse ? toConditionsList(conditionListResponse, prisonNumber) : null
    } catch (e) {
      logger.error(`Error getting Conditions for [${prisonNumber}]`, e)
      throw e
    }
  }
}
