import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

const stubReviewEducationSupportPlan = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan/review`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const stubReviewEducationSupportPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan/review`,
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

const stubGetEducationSupportPlanReviews = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan/review`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reviews: [
          {
            reviewCreatedBy: null,
            otherContributors: null,
            prisonerDeclinedFeedback: false,
            prisonerFeedback: 'Chris is happy with his progress',
            reviewerFeedback: 'I am happy with progress but we need to keep working on the plan',
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

const stubGetEducationSupportPlanReviews404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan/review`,
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

const stubGetEducationSupportPlanReviews500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan/review`,
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
  stubReviewEducationSupportPlan,
  stubReviewEducationSupportPlan500Error,
  stubGetEducationSupportPlanReviews,
  stubGetEducationSupportPlanReviews404Error,
  stubGetEducationSupportPlanReviews500Error,
}
