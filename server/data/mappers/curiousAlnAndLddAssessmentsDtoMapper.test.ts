import { startOfDay } from 'date-fns'
import {
  aCuriousAlnAndLddAssessmentsDto,
  aCuriousAlnAssessmentDto,
  aCuriousLddAssessmentDto,
} from '../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'
import toCuriousAlnAndLddAssessmentsDto from './curiousAlnAndLddAssessmentsDtoMapper'
import {
  aLearnerAssessmentV2DTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  anAllAssessmentDTO,
  anAlnLearnerAssessmentsDTO,
  anExternalAssessmentsDTO,
} from '../../testsupport/curiousAssessmentsTestDataBuilder'
import AlnAssessmentReferral from '../../enums/alnAssessmentReferral'

describe('curiousAlnAndLddAssessmentsDtoMapper', () => {
  describe('toCuriousAlnAndLddAssessmentsDto', () => {
    it('should map a CuriousAllAssessmentDTO to a CuriousAlnAndLddAssessmentsDto', () => {
      // Given
      const curiousApiResponse = anAllAssessmentDTO({
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

      const expected = aCuriousAlnAndLddAssessmentsDto({
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
            referral: AlnAssessmentReferral.EDUCATION_SPECIALIST,
            supportPlanRequired: true,
          }),
        ],
      })

      // When
      const actual = toCuriousAlnAndLddAssessmentsDto(curiousApiResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it.each([
      { v1: null, v2: null },
      { v1: [], v2: null },
      { v1: [], v2: {} },
      { v1: [], v2: { assessments: null } },
      { v1: [], v2: { assessments: { aln: null } } },
      { v1: [], v2: { assessments: { aln: [] } } },
    ])('should map null or empty data from Curious to a CuriousAlnAndLddAssessmentsDto - %s', curiousAssessments => {
      // Given
      const curiousApiResponse = anAllAssessmentDTO({
        v1Assessments: curiousAssessments.v1,
        v2Assessments: curiousAssessments.v2,
      })

      const expected = aCuriousAlnAndLddAssessmentsDto({
        lddAssessments: [],
        alnAssessments: [],
      })

      // When
      const actual = toCuriousAlnAndLddAssessmentsDto(curiousApiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Curious V1 LDD assessment mappings', () => {
    it('should map multiple Curious LDD assessments', () => {
      // Given
      const curiousApiResponse = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: ['Colour blindness'],
                inDepthAssessmentDate: '2013-02-16',
                rapidAssessmentDate: null,
              }),
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'BXI',
                lddPrimaryName: 'Hearing impairment',
                lddSecondaryNames: ['Partial deafness', 'Deafness'],
                inDepthAssessmentDate: null,
                rapidAssessmentDate: '2012-02-16',
              }),
            ],
          }),
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'LEI',
                lddPrimaryName: 'Dyslexia',
                lddSecondaryNames: [],
                inDepthAssessmentDate: '2013-03-16',
                rapidAssessmentDate: '2013-03-17',
              }),
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'BFI',
                lddPrimaryName: 'Mental health difficulty',
                lddSecondaryNames: ['ADHD', 'ADHD-related disorders'],
                inDepthAssessmentDate: '2013-04-16',
                rapidAssessmentDate: null,
              }),
            ],
          }),
        ],
      })

      const expected = [
        aCuriousLddAssessmentDto({
          prisonId: 'MDI',
          rapidAssessmentDate: null,
          inDepthAssessmentDate: startOfDay('2013-02-16'),
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: ['Colour blindness'],
        }),
        aCuriousLddAssessmentDto({
          prisonId: 'BXI',
          rapidAssessmentDate: startOfDay('2012-02-16'),
          inDepthAssessmentDate: null,
          primaryLddAndHealthNeed: 'Hearing impairment',
          additionalLddAndHealthNeeds: ['Partial deafness', 'Deafness'],
        }),
        aCuriousLddAssessmentDto({
          prisonId: 'LEI',
          rapidAssessmentDate: startOfDay('2013-03-17'),
          inDepthAssessmentDate: startOfDay('2013-03-16'),
          primaryLddAndHealthNeed: 'Dyslexia',
          additionalLddAndHealthNeeds: [],
        }),
        aCuriousLddAssessmentDto({
          prisonId: 'BFI',
          rapidAssessmentDate: null,
          inDepthAssessmentDate: startOfDay('2013-04-16'),
          primaryLddAndHealthNeed: 'Mental health difficulty',
          additionalLddAndHealthNeeds: ['ADHD', 'ADHD-related disorders'],
        }),
      ]

      // When
      const actual = toCuriousAlnAndLddAssessmentsDto(curiousApiResponse)

      // Then
      expect(actual.lddAssessments).toEqual(expected)
    })

    it('should only map Curious LDD assessments with populated data', () => {
      // Given
      const curiousApiResponse = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: ['Colour blindness'],
                inDepthAssessmentDate: '2013-02-16',
                rapidAssessmentDate: null,
              }), // expected to be mapped
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'BXI',
                lddPrimaryName: 'Hearing impairment',
                lddSecondaryNames: ['Partial deafness', 'Deafness'],
                inDepthAssessmentDate: null,
                rapidAssessmentDate: '2012-02-16',
              }), // expected to be mapped
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'LEI',
                lddPrimaryName: null,
                lddSecondaryNames: [],
                inDepthAssessmentDate: null,
                rapidAssessmentDate: null,
              }), // not expected to be mapped because it does not contain lddPrimaryName and at least one of the assessment dates
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'BFI',
                lddPrimaryName: 'Mental health difficulty',
                lddSecondaryNames: [],
                inDepthAssessmentDate: null,
                rapidAssessmentDate: null,
              }), // not expected to be mapped because it does not contain lddPrimaryName and at least one of the assessment dates
            ],
          }),
        ],
      })

      const expected = [
        aCuriousLddAssessmentDto({
          prisonId: 'MDI',
          rapidAssessmentDate: null,
          inDepthAssessmentDate: startOfDay('2013-02-16'),
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: ['Colour blindness'],
        }),
        aCuriousLddAssessmentDto({
          prisonId: 'BXI',
          rapidAssessmentDate: startOfDay('2012-02-16'),
          inDepthAssessmentDate: null,
          primaryLddAndHealthNeed: 'Hearing impairment',
          additionalLddAndHealthNeeds: ['Partial deafness', 'Deafness'],
        }),
      ]

      // When
      const actual = toCuriousAlnAndLddAssessmentsDto(curiousApiResponse)

      // Then
      expect(actual.lddAssessments).toEqual(expected)
    })
  })

  describe('Curious V2 ALN assessment mappings', () => {
    it.each([
      { curiousValue: 'Healthcare', expected: AlnAssessmentReferral.HEALTHCARE },
      { curiousValue: 'Psychology', expected: AlnAssessmentReferral.PSYCHOLOGY },
      { curiousValue: 'Education Specialist', expected: AlnAssessmentReferral.EDUCATION_SPECIALIST },
      { curiousValue: 'NSM', expected: AlnAssessmentReferral.NSM },
      { curiousValue: 'Substance Misuse Team', expected: AlnAssessmentReferral.SUBSTANCE_MISUSE_TEAM },
      { curiousValue: 'Safer Custody', expected: AlnAssessmentReferral.SAFER_CUSTODY },
      { curiousValue: 'Other', expected: AlnAssessmentReferral.OTHER },
    ] as Array<{
      curiousValue:
        | 'Healthcare'
        | 'Psychology'
        | 'Education Specialist'
        | 'NSM'
        | 'Substance Misuse Team'
        | 'Safer Custody'
        | 'Other'
      expected: AlnAssessmentReferral
    }>)(
      'should correctly map Curious stakeholder referral value "$curiousValue" to "$expected"',
      ({ curiousValue, expected }) => {
        // Given
        const curiousApiResponse = anAllAssessmentDTO({
          v2Assessments: aLearnerAssessmentV2DTO({
            assessments: anExternalAssessmentsDTO({
              alnAssessments: [
                anAlnLearnerAssessmentsDTO({
                  stakeholderReferral: curiousValue,
                }),
              ],
            }),
          }),
        })

        // When
        const actual = toCuriousAlnAndLddAssessmentsDto(curiousApiResponse)

        // Then
        expect(actual.alnAssessments[0].referral).toEqual(expected)
      },
    )

    it.each([
      { curiousValue: 'Yes', expected: true },
      { curiousValue: 'No', expected: false },
    ] as Array<{
      curiousValue: 'Yes' | 'No'
      expected: boolean
    }>)(
      'should correctly map Curious assessmentOutcome value "$curiousValue" to support plan required "$expected"',
      ({ curiousValue, expected }) => {
        // Given
        const curiousApiResponse = anAllAssessmentDTO({
          v2Assessments: aLearnerAssessmentV2DTO({
            assessments: anExternalAssessmentsDTO({
              alnAssessments: [
                anAlnLearnerAssessmentsDTO({
                  assessmentOutcome: curiousValue,
                }),
              ],
            }),
          }),
        })

        // When
        const actual = toCuriousAlnAndLddAssessmentsDto(curiousApiResponse)

        // Then
        expect(actual.alnAssessments[0].supportPlanRequired).toEqual(expected)
      },
    )
  })
})
