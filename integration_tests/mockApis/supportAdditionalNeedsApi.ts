import { addMonths, format, startOfToday } from 'date-fns'
import type { Person } from 'supportAdditionalNeedsApiClient'
import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'
import SearchSortField from '../../server/enums/searchSortField'
import SearchSortDirection from '../../server/enums/searchSortDirection'
import { prisoners } from '../mockData/prisonerByIdData'
import PlanCreationScheduleStatus from '../../server/enums/planCreationScheduleStatus'

const stubSearchByPrison = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  page?: number
  pageSize?: number
  sortBy?: SearchSortField
  sortDirection?: SearchSortDirection
  pageOfPrisoners?: Array<Person>
  totalRecords?: number
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SearchSortField.PRISONER_NAME
  const sortDirection = options?.sortDirection || SearchSortDirection.ASC

  const returnedPrisoners: Array<Person> =
    options?.pageOfPrisoners ||
    Object.values(prisoners)
      .filter(prisoner => prisoner.response.jsonBody.prisonId === prisonId)
      .map(prisoner => prisoner.response.jsonBody)
      .map(prisoner => ({
        ...prisoner,
        prisonNumber: prisoner.prisonerNumber,
        forename: prisoner.firstName,
        surname: prisoner.lastName,
        firstName: prisoner.firstName,
        additionalNeedsSummary: {
          hasConditions: true,
          hasChallenges: true,
          hasStrengths: true,
          hasSupportRecommendations: true,
        },
      }))
  const totalElements = options?.totalRecords || returnedPrisoners.length
  const totalPages = Math.ceil(totalElements / pageSize)
  const first = totalPages === 1 || page === 1
  const last = totalPages === 1 || page === totalPages

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/search/prisons/${prisonId}/people`,
      queryParameters: {
        prisonerNameOrNumber: { equalTo: options?.prisonerNameOrNumber || '' },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: `${sortBy}` },
        sortDirection: { equalTo: `${sortDirection}` },
      },
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        pagination: {
          totalElements,
          totalPages,
          page,
          last,
          first,
          pageSize,
        },
        people: returnedPrisoners,
      },
    },
  })
}

const stubSearchByPrison500Error = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  page?: number
  pageSize?: number
  sortBy?: SearchSortField
  sortDirection?: SearchSortDirection
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SearchSortField.PRISONER_NAME
  const sortDirection = options?.sortDirection || SearchSortDirection.ASC

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/search/prisons/${prisonId}/people`,
      queryParameters: {
        prisonerNameOrNumber: { equalTo: options?.prisonerNameOrNumber || '' },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: `${sortBy}` },
        sortDirection: { equalTo: `${sortDirection}` },
      },
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })
}

const stubCreateEducationSupportPlan = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        hasCurrentEhcp: false,
        planCreatedBy: null,
        otherContributors: null,
        learningEnvironmentAdjustments: 'Needs to sit at the front of the class',
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: '2023-06-19T09:39:44Z',
        createdAtPrison: 'MDI',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: '2023-06-19T09:39:44Z',
        updatedAtPrison: 'MDI',
      },
    },
  })

const stubCreateEducationSupportPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan`,
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
  stubSearchByPrison,
  stubSearchByPrison500Error,
  stubCreateEducationSupportPlan,
  stubCreateEducationSupportPlan500Error,
  stubUpdateEducationSupportPlanCreationStatus,
  stubUpdateEducationSupportPlanCreationStatus500Error,
  stubGetEducationSupportPlanCreationSchedules,
  stubGetEducationSupportPlanCreationSchedules404Error,
  stubGetEducationSupportPlanCreationSchedules500Error,
  stubSupportAdditionalNeedsApiPing: stubPing('support-additional-needs-api'),
}
