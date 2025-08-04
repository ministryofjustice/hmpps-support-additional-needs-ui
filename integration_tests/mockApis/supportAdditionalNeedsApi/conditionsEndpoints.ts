import { SuperAgentRequest } from 'superagent'
import type { ConditionResponse } from 'supportAdditionalNeedsApiClient'
import { stubFor } from '../wiremock'

const stubCreateConditions = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/conditions`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        conditions: [
          {
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'BXI',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            source: 'SELF_DECLARED',
            conditionType: {
              code: 'string',
              description: 'string',
              categoryCode: 'string',
              categoryDescription: 'string',
              areaCode: 'string',
              areaDescription: 'string',
              listSequence: 3,
              active: true,
            },
            conditionName: '(for Mental Health) Social Anxiety',
            conditionDetails: 'string',
            active: true,
          },
        ],
      },
    },
  })

const stubCreateConditions500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/conditions`,
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

const stubGetConditions = (
  options: { prisonNumber: string; conditions?: Array<ConditionResponse> } = { prisonNumber: 'G6115VJ' },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${options.prisonNumber}/conditions`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        conditions: options.conditions ?? [
          {
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'BXI',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            source: 'SELF_DECLARED',
            conditionType: {
              code: 'string',
              description: 'string',
              categoryCode: 'string',
              categoryDescription: 'string',
              areaCode: 'string',
              areaDescription: 'string',
              listSequence: 3,
              active: true,
            },
            conditionName: '(for Mental Health) Social Anxiety',
            conditionDetails: 'string',
            active: true,
          },
        ],
      },
    },
  })

const stubGetConditions500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/conditions`,
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

export default { stubCreateConditions, stubCreateConditions500Error, stubGetConditions, stubGetConditions500Error }
