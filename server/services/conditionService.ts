import type { ConditionDto, ConditionsList } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import { toCreateConditionsRequest } from '../data/mappers/createConditionsRequestMapper'
import logger from '../../logger'
import { toConditionDto, toConditionsList } from '../data/mappers/conditionDtoMapper'
import toUpdateConditionRequest from '../data/mappers/updateConditionRequestMapper'

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
      return toConditionsList(conditionListResponse, prisonNumber)
    } catch (e) {
      logger.error(`Error getting Conditions for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getCondition(username: string, prisonNumber: string, conditionReference: string): Promise<ConditionDto> {
    try {
      const conditionResponse = await this.supportAdditionalNeedsApiClient.getCondition(
        prisonNumber,
        conditionReference,
        username,
      )
      return toConditionDto(prisonNumber, conditionResponse)
    } catch (e) {
      logger.error(`Error getting Condition for [${prisonNumber}]`, e)
      throw e
    }
  }

  async updateCondition(username: string, conditionReference: string, condition: ConditionDto): Promise<void> {
    const { prisonNumber } = condition
    try {
      const updateConditionRequest = toUpdateConditionRequest(condition)
      await this.supportAdditionalNeedsApiClient.updateCondition(
        prisonNumber,
        conditionReference,
        username,
        updateConditionRequest,
      )
    } catch (e) {
      logger.error(`Error updating Condition for [${prisonNumber}]`, e)
      throw e
    }
  }
}
