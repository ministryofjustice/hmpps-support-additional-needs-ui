import type { PlanCreationScheduleResponse } from 'supportAdditionalNeedsApiClient'
import type { EducationSupportPlanDto, PlanCreationScheduleDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import toCreateEducationSupportPlanRequest from '../data/mappers/createEducationSupportPlanRequestMapper'
import logger from '../../logger'
import toEducationSupportPlanDto from '../data/mappers/educationSupportPlanDtoMapper'
import toPlanCreationScheduleDto from '../data/mappers/planCreationScheduleDtoMapper'

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

  /**
   * Returns the prisoner's current (most recent) Education Support Plan Creation Schedule (PlanCreationScheduleDto),
   * or null if the prisoner does not have a Plan Creation Schedule setup.
   *
   * If the most recent Plan Creation Schedule is COMPLETED or EXEMPT_ it will be returned and the calling code should
   * determine what to do in this case.
   */
  async getCurrentEducationSupportPlanCreationSchedule(
    prisonNumber: string,
    username: string,
  ): Promise<PlanCreationScheduleDto> {
    try {
      const includeAllHistory = false
      const apiResponse = await this.supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules(
        prisonNumber,
        username,
        includeAllHistory,
      )

      const planCreationSchedules: Array<PlanCreationScheduleResponse> = apiResponse?.planCreationSchedules || []
      if (planCreationSchedules.length === 0) {
        return null
      }

      const currentSchedule =
        planCreationSchedules.length === 1
          ? planCreationSchedules.at(0)
          : planCreationSchedules //
              .toSorted((left, right) => left.version - right.version)
              .toReversed()
              .at(0)
      return toPlanCreationScheduleDto(prisonNumber, currentSchedule)
    } catch (e) {
      logger.error('Error retrieving education support plan creation schedule', e)
      throw e
    }
  }
}
