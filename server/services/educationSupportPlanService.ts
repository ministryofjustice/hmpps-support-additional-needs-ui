import type { EducationSupportPlanDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import toCreateEducationSupportPlanRequest from '../data/mappers/createEducationSupportPlanRequestMapper'
import logger from '../../logger'
import toEducationSupportPlanDto from '../data/mappers/educationSupportPlanDtoMapper'

export default class EducationSupportPlanService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async createEducationSupportPlan(username: string, dto: EducationSupportPlanDto): Promise<EducationSupportPlanDto> {
    try {
      const { prisonNumber } = dto
      const createEducationSupportPlanRequest = toCreateEducationSupportPlanRequest(dto)
      const apiResponse = await this.supportAdditionalNeedsApiClient.createEducationSupportPlan(
        prisonNumber,
        username,
        createEducationSupportPlanRequest,
      )
      return toEducationSupportPlanDto(prisonNumber, apiResponse)
    } catch (e) {
      logger.error(`Error creating education support plan`, e)
      throw e
    }
  }
}
