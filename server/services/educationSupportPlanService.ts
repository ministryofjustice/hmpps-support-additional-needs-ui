import type { EducationSupportPlanDto, EhcpStatusDto, PlanLifecycleStatusDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import toCreateEducationSupportPlanRequest from '../data/mappers/createEducationSupportPlanRequestMapper'
import toEducationSupportPlanDto from '../data/mappers/educationSupportPlanDtoMapper'
import logger from '../../logger'
import toPlanLifecycleStatusDto from '../data/mappers/planLifecycleStatusDtoMapper'
import toUpdateEhcpRequest from '../data/mappers/updateEhcpRequestMapper'
import toEhcpStatusDto from '../data/mappers/ehcpStatusDtoMapper'

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
      logger.error('Error creating education support plan', e)
      throw e
    }
  }

  async getEducationSupportPlan(username: string, prisonNumber: string): Promise<EducationSupportPlanDto> {
    try {
      const apiResponse = await this.supportAdditionalNeedsApiClient.getEducationSupportPlan(prisonNumber, username)
      return toEducationSupportPlanDto(prisonNumber, apiResponse)
    } catch (e) {
      logger.error(`Error getting education support plan for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getEducationSupportPlanLifecycleStatus(
    username: string,
    prisonNumber: string,
  ): Promise<PlanLifecycleStatusDto> {
    try {
      const apiResponse = await this.supportAdditionalNeedsApiClient.getPlanActionStatus(prisonNumber, username)
      return toPlanLifecycleStatusDto(apiResponse)
    } catch (e) {
      logger.error(`Error getting education support plan action status for [${prisonNumber}]`, e)
      throw e
    }
  }

  async updateEhcpStatus(
    username: string,
    prisonNumber: string,
    educationSupportPlanDto: EducationSupportPlanDto,
  ): Promise<EhcpStatusDto> {
    try {
      const updateEhcpRequest = toUpdateEhcpRequest(educationSupportPlanDto)
      const apiResponse = await this.supportAdditionalNeedsApiClient.updateEhcpStatus(
        prisonNumber,
        username,
        updateEhcpRequest,
      )
      return toEhcpStatusDto(apiResponse)
    } catch (e) {
      logger.error(`Error updating EHCP status for [${prisonNumber}]`, e)
      throw e
    }
  }
}
