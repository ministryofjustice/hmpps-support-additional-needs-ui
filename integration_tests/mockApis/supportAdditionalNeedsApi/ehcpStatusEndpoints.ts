import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

const stubUpdateEchpStatus = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/ehcp-status`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        hasCurrentEhcp: true,
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

const stubUpdateEchpStatus500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/ehcp-status`,
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

const stubGetEhcpStatus = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/ehcp-status`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        hasCurrentEhcp: true,
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

const stubGetEhcpStatus404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/ehcp-status`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `Education Support Plan for ${prisonNumber} not found`,
      },
    },
  })

const stubGetEhcpStatus500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/ehcp-status`,
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

export default {
  stubUpdateEchpStatus,
  stubUpdateEchpStatus500Error,
  stubGetEhcpStatus,
  stubGetEhcpStatus404Error,
  stubGetEhcpStatus500Error,
}
