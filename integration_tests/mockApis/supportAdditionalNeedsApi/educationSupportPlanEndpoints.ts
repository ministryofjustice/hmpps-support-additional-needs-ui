import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

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
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
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

const stubGetEducationSupportPlan = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        hasCurrentEhcp: false,
        planCreatedBy: { name: 'Mr A. Teacher', jobRole: 'Education Instructor' },
        otherContributors: [
          { name: 'Mrs B. Teacher', jobRole: 'Education Instructor' },
          { name: 'Mrs C. Assistant', jobRole: 'Education Assistant' },
        ],
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 15,
        individualSupport: 'Chris is feeling positive and is keen to learn',
        detail: 'Chris responded well to the discussion about his learning needs and education plan',
        reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
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

const stubGetEducationSupportPlan404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/education-support-plan`,
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

const stubGetEducationSupportPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
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

export default {
  stubCreateEducationSupportPlan,
  stubCreateEducationSupportPlan500Error,
  stubGetEducationSupportPlan,
  stubGetEducationSupportPlan404Error,
  stubGetEducationSupportPlan500Error,
}
