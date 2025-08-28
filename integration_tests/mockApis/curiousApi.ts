import { SuperAgentRequest } from 'superagent'
import type { LearnerAssessmentsAlnDTO, LearnerLddInfoExternalV1DTO } from 'curiousApiClient'
import { stubFor } from './wiremock'

const stubGetCuriousV2Assessments = (
  options: {
    prisonNumber?: string
    lddAssessments?: Array<LearnerLddInfoExternalV1DTO>
    alnAssessments?: Array<LearnerAssessmentsAlnDTO>
  } = { prisonNumber: 'G6115VJ' },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/curious-api/learnerAssessments/v2/${options.prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        v1: [
          {
            prn: options.prisonNumber,
            qualifications: [
              {
                establishmentId: 'WDI',
                establishmentName: 'WAKEFIELD (HMP)',
                qualification: {
                  qualificationType: 'English',
                  qualificationGrade: 'Level 1',
                  assessmentDate: '2021-05-03',
                },
              },
              {
                establishmentId: 'MDI',
                establishmentName: 'MOORLAND (HMP & YOI)',
                qualification: {
                  qualificationType: 'Maths',
                  qualificationGrade: 'Entry Level 1',
                  assessmentDate: '2021-07-01',
                },
              },
              {
                establishmentId: 'MDI',
                establishmentName: 'MOORLAND (HMP & YOI)',
                qualification: {
                  qualificationType: 'Digital Literacy',
                  qualificationGrade: 'Entry Level 3',
                  assessmentDate: '2021-07-01',
                },
              },
            ],
            ldd: options.lddAssessments ?? [
              {
                establishmentName: 'MOORLAND (HMP & YOI)',
                establishmentId: 'MDI',
                rapidAssessmentDate: null,
                inDepthAssessmentDate: '2023-08-13',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: ['Colour blindness'],
              },
              {
                establishmentName: 'WAKEFIELD (HMP)',
                establishmentId: 'WDI',
                rapidAssessmentDate: '2020-03-28',
                inDepthAssessmentDate: null,
                lddPrimaryName: 'Dyslexia',
                lddSecondaryNames: null,
              },
            ],
          },
        ],
        v2: {
          prn: options.prisonNumber,
          assessments: {
            englishFunctionalSkills: null,
            mathsFunctionalSkills: null,
            digitalSkillsFunctionalSkills: null,
            aln: options.alnAssessments ?? [
              {
                establishmentId: 'MDI',
                establishmentName: 'MOORLAND (HMP & YOI)',
                assessmentDate: '2025-10-01',
                assessmentOutcome: 'Yes',
                hasPrisonerConsent: 'Yes',
                stakeholderReferral: 'Education Specialist',
              },
            ],
            esol: null,
            reading: null,
          },
        },
      },
    },
  })

const stubGetCuriousV2Assessments404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/curious-api/learnerAssessments/v2/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `Challenges for ${prisonNumber} not found`,
      },
    },
  })

const stubGetCuriousV2Assessments500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/curious-api/learnerAssessments/v2/${prisonNumber}`,
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

const stubCuriousApiPing = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/curious-api/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'text/plan;charset=UTF-8' },
      body: 'pong',
    },
  })

export default {
  stubGetCuriousV2Assessments,
  stubGetCuriousV2Assessments404Error,
  stubGetCuriousV2Assessments500Error,
  stubCuriousApiPing,
}
