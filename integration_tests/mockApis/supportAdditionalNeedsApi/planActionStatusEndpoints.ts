import { SuperAgentRequest } from 'superagent'
import type { PlanActionStatus } from 'supportAdditionalNeedsApiClient'
import { stubFor } from '../wiremock'
import aPlanActionStatus from '../../../server/testsupport/planActionStatusTestDataBuilder'

const stubGetPlanActionStatus = (options?: {
  prisonNumber?: string
  planActionStatus?: PlanActionStatus
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${options?.prisonNumber || 'G6115VJ'}/plan-action-status`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options?.planActionStatus ||
        aPlanActionStatus({
          status: 'PLAN_DECLINED',
          planCreationDeadlineDate: '2025-10-01',
          reviewDeadlineDate: null,
          exemptionReason: 'EXEMPT_REFUSED_TO_ENGAGE',
          exemptionDetail: 'Chris feels he does not need a support plan',
          exemptionRecordedAt: '2025-10-02',
          exemptionRecordedBy: 'Alex Smith',
        }),
    },
  })

const stubGetPlanActionStatus500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/plan-action-status`,
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

export default { stubGetPlanActionStatus, stubGetPlanActionStatus500Error }
