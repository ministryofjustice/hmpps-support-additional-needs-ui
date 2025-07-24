import { SuperAgentRequest } from 'superagent'
import { addMonths, format, startOfToday } from 'date-fns'
import { stubFor } from '../wiremock'
import PlanCreationScheduleStatus from '../../../server/enums/planCreationScheduleStatus'

const stubUpdateEducationSupportPlanCreationStatus = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PATCH',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/plan-creation-schedule/status`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        planCreationSchedules: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            deadlineDate: format(addMonths(startOfToday(), 2), 'yyyy-MM-dd'),
            status: PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
            exemptionReason: 'EXEMPT_REFUSED_TO_ENGAGE',
            exemptionDetail: 'Chris would not engage or cooperate with me today',
            version: 1,
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
          },
        ],
      },
    },
  })

const stubUpdateEducationSupportPlanCreationStatus500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PATCH',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/plan-creation-schedule/status`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const stubGetEducationSupportPlanCreationSchedules = (options?: {
  prisonNumber?: string
  includeAllHistory?: boolean
  status?: PlanCreationScheduleStatus
}): SuperAgentRequest => {
  const prisonNumber = options?.prisonNumber || 'G6115VJ'
  const includeAllHistory = options?.includeAllHistory || false
  const status = options?.status || PlanCreationScheduleStatus.SCHEDULED

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/profile/${prisonNumber}/plan-creation-schedule`,
      queryParameters: {
        includeAllHistory: { equalTo: `${includeAllHistory}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        planCreationSchedules: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            deadlineDate: format(addMonths(startOfToday(), 2), 'yyyy-MM-dd'),
            status,
            exemptionReason:
              status === PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY ? 'EXEMPT_REFUSED_TO_ENGAGE' : undefined,
            exemptionDetail:
              status === PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY
                ? 'Chris would not engage or cooperate with me today'
                : undefined,
            version: 1,
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
          },
        ],
      },
    },
  })
}

const stubGetEducationSupportPlanCreationSchedules404Error = (options?: {
  prisonNumber?: string
  includeAllHistory?: boolean
}): SuperAgentRequest => {
  const prisonNumber = options?.prisonNumber || 'G6115VJ'
  const includeAllHistory = options?.includeAllHistory || false

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/profile/${prisonNumber}/plan-creation-schedule`,
      queryParameters: {
        includeAllHistory: { equalTo: `${includeAllHistory}` },
      },
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `Plan Creation Schedules for ${prisonNumber} not found`,
      },
    },
  })
}

const stubGetEducationSupportPlanCreationSchedules500Error = (options?: {
  prisonNumber?: string
  includeAllHistory?: boolean
}): SuperAgentRequest => {
  const prisonNumber = options?.prisonNumber || 'G6115VJ'
  const includeAllHistory = options?.includeAllHistory || false

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/profile/${prisonNumber}/plan-creation-schedule`,
      queryParameters: {
        includeAllHistory: { equalTo: `${includeAllHistory}` },
      },
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })
}

export default {
  stubUpdateEducationSupportPlanCreationStatus,
  stubUpdateEducationSupportPlanCreationStatus500Error,
  stubGetEducationSupportPlanCreationSchedules,
  stubGetEducationSupportPlanCreationSchedules404Error,
  stubGetEducationSupportPlanCreationSchedules500Error,
}
