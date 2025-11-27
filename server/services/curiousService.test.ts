import { startOfDay } from 'date-fns'
import CuriousApiClient from '../data/curiousApiClient'
import CuriousService from './curiousService'
import {
  aCuriousAlnAndLddAssessmentsDto,
  aCuriousAlnAssessmentDto,
  aCuriousLddAssessmentDto,
} from '../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'
import {
  aLearnerAssessmentV2DTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  anAllAssessmentDTO,
  anAlnLearnerAssessmentsDTO,
  anExternalAssessmentsDTO,
} from '../testsupport/curiousAssessmentsTestDataBuilder'
import AlnAssessmentReferral from '../enums/alnAssessmentReferral'

jest.mock('../data/curiousApiClient')

describe('curiousService', () => {
  const curiousApiClient = new CuriousApiClient(null) as jest.Mocked<CuriousApiClient>
  const service = new CuriousService(curiousApiClient)

  const prisonNumber = 'A1234BC'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getAlnAndLddAssessments', () => {
    it('should get ALN and LDD Assessments', async () => {
      // Given
      const curiousAssessmentsResponse = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: [
                  'Hearing impairment',
                  'Mental health difficulty',
                  'Social and emotional difficulties',
                ],
                inDepthAssessmentDate: '2013-02-16',
                rapidAssessmentDate: '2012-02-16',
              }),
            ],
          }),
        ],
        v2Assessments: aLearnerAssessmentV2DTO({
          assessments: anExternalAssessmentsDTO({
            alnAssessments: [
              anAlnLearnerAssessmentsDTO({
                prisonId: 'MDI',
                assessmentDate: '2025-10-01',
                assessmentOutcome: 'Yes',
                hasPrisonerConsent: 'Yes',
                stakeholderReferral: 'Education Specialist',
              }),
            ],
          }),
        }),
      })
      curiousApiClient.getAssessmentsByPrisonNumber.mockResolvedValue(curiousAssessmentsResponse)

      const expectedAssessments = aCuriousAlnAndLddAssessmentsDto({
        lddAssessments: [
          aCuriousLddAssessmentDto({
            prisonId: 'MDI',
            rapidAssessmentDate: startOfDay('2012-02-16'),
            inDepthAssessmentDate: startOfDay('2013-02-16'),
            primaryLddAndHealthNeed: 'Visual impairment',
            additionalLddAndHealthNeeds: [
              'Hearing impairment',
              'Mental health difficulty',
              'Social and emotional difficulties',
            ],
          }),
        ],
        alnAssessments: [
          aCuriousAlnAssessmentDto({
            prisonId: 'MDI',
            assessmentDate: startOfDay('2025-10-01'),
            referral: [AlnAssessmentReferral.EDUCATION_SPECIALIST],
            supportPlanRequired: true,
          }),
        ],
      })

      // When
      const actual = await service.getAlnAndLddAssessments(prisonNumber)

      // Then
      expect(actual).toEqual(expectedAssessments)
      expect(curiousApiClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })
  })

  it('should return empty CuriousAlnAndLddAssessmentsDto given API returns null', async () => {
    // Given
    curiousApiClient.getAssessmentsByPrisonNumber.mockResolvedValue(null)

    const expectedAssessments = aCuriousAlnAndLddAssessmentsDto({
      lddAssessments: [],
      alnAssessments: [],
    })

    // When
    const actual = await service.getAlnAndLddAssessments(prisonNumber)

    // Then
    expect(actual).toEqual(expectedAssessments)
    expect(curiousApiClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
  })

  it('should rethrow error given API client throws error', async () => {
    // Given
    const expectedError = new Error('Internal Server Error')
    curiousApiClient.getAssessmentsByPrisonNumber.mockRejectedValue(expectedError)

    // When
    const actual = await service.getAlnAndLddAssessments(prisonNumber).catch(e => e)

    // Then
    expect(actual).toEqual(expectedError)
    expect(curiousApiClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
  })
})
