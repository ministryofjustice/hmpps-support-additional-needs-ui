import type { PlanCreationScheduleResponse, PlanCreationSchedulesResponse } from 'supportAdditionalNeedsApiClient'
import type { PlanCreationScheduleDto, RefuseEducationSupportPlanDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import toPlanCreationScheduleDto from '../data/mappers/planCreationScheduleDtoMapper'
import toUpdatePlanCreationStatusRequest from '../data/mappers/updatePlanCreationStatusRequestMapper'
import logger from '../../logger'

export default class EducationSupportPlanScheduleService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

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
        logger.debug(`Prisoner ${prisonNumber} has no Education Support Plan Creation Schedule. Returning null.`)
        return null
      }

      return this.currentPlanCreationSchedule(prisonNumber, apiResponse)
    } catch (e) {
      logger.error('Error retrieving education support plan creation schedule', e)
      throw e
    }
  }

  async updateEducationSupportPlanCreationScheduleAsRefused(
    username: string,
    dto: RefuseEducationSupportPlanDto,
  ): Promise<PlanCreationScheduleDto> {
    try {
      const updatePlanCreationStatusRequest = toUpdatePlanCreationStatusRequest(dto)
      const apiResponse = await this.supportAdditionalNeedsApiClient.updateEducationSupportPlanCreationScheduleStatus(
        dto.prisonNumber,
        username,
        updatePlanCreationStatusRequest,
      )

      return this.currentPlanCreationSchedule(dto.prisonNumber, apiResponse)
    } catch (e) {
      logger.error('Error updating education support plan creation schedule as Refused', e)
      throw e
    }
  }

  private currentPlanCreationSchedule = (
    prisonNumber: string,
    apiResponse: PlanCreationSchedulesResponse,
  ): PlanCreationScheduleDto => {
    const { planCreationSchedules }: { planCreationSchedules: Array<PlanCreationScheduleResponse> } = apiResponse
    const currentSchedule =
      planCreationSchedules.length === 1
        ? planCreationSchedules.at(0)
        : planCreationSchedules //
            .toSorted((left, right) => left.version - right.version)
            .toReversed()
            .at(0)
    return toPlanCreationScheduleDto(prisonNumber, currentSchedule)
  }
}
