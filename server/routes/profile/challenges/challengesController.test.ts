import { Request, Response } from 'express'
import { startOfToday, subDays } from 'date-fns'
import type { StrengthResponseDto } from 'dto'
import ChallengesController from './challengesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidChallengeResponse } from '../../../testsupport/challengeResponseTestDataBuilder'
import ChallengeType from '../../../enums/challengeType'
import { Result } from '../../../utils/result/result'
import { aValidAlnScreenerList, aValidAlnScreenerResponseDto } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeCategory from '../../../enums/challengeCategory'

describe('challengesController', () => {
  const controller = new ChallengesController()

  const today = startOfToday()

  const prisonerSummary = aValidPrisonerSummary()
  const challenges = Result.fulfilled([aValidChallengeResponse()])
  const alnScreeners = Result.fulfilled(
    aValidAlnScreenerList({
      screeners: [
        // Latest screener
        aValidAlnScreenerResponseDto({
          screenerDate: today,
          createdAtPrison: 'BXI',
          strengths: [],
          challenges: [],
        }),
        // Screener from yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(today, 1) }),
        // Screener from the day before yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(today, 2) }),
      ],
    }),
  )
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, challenges, alnScreeners, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/challenges/index'

    const expectedViewModel = expect.objectContaining({
      prisonNamesById,
      prisonerSummary,
      tab: 'challenges',
      groupedChallenges: expect.objectContaining({
        status: 'fulfilled',
        value: {},
      }),
    })

    // When
    await controller.getChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should group challenges by category correctly', () => {
    // Given
    const groupedChallenges = controller.getChallengesByType(
      [
        {
          challengeCategory: ChallengeCategory.MEMORY,
          active: true,
          fromALNScreener: false,
          challengeTypeCode: ChallengeType.BALANCE,
        },
        {
          challengeCategory: ChallengeCategory.MEMORY,
          active: true,
          fromALNScreener: false,
          challengeTypeCode: ChallengeType.ACTIVE_LISTENING,
        },
        {
          challengeCategory: ChallengeCategory.MEMORY,
          active: true,
          fromALNScreener: false,
          challengeTypeCode: ChallengeType.HANDWRITING,
        },
      ],
      {
        screeners: [
          {
            screenerDate: today,
            challenges: [
              aValidChallengeResponseDto({ fromALNScreener: true, challengeCategory: ChallengeCategory.MEMORY }),
            ],
            strengths: new Array<StrengthResponseDto>(),
          },
        ],
        prisonNumber: '123456',
      },
    )

    // Then
    expect(groupedChallenges.MEMORY.nonAlnChallenges).toHaveLength(3)
    expect(groupedChallenges.MEMORY.alnChallenges).toHaveLength(1)
  })

  it('should sort challenges by category and within category', () => {
    // Given
    const groupedChallenges = controller.getChallengesByType(
      [
        {
          challengeCategory: ChallengeCategory.SENSORY,
          active: true,
          fromALNScreener: false,
          createdAt: new Date('2025-01-03'),
          challengeTypeCode: undefined,
        },
        {
          challengeCategory: ChallengeCategory.SENSORY,
          active: true,
          fromALNScreener: false,
          challengeTypeCode: '123',
          createdAt: new Date('2025-01-02'),
        },
        {
          challengeCategory: ChallengeCategory.SENSORY,
          active: true,
          fromALNScreener: false,
          createdAt: new Date('2025-01-01'),
          challengeTypeCode: '122',
        },
        {
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          active: true,
          fromALNScreener: false,
          createdAt: new Date('2025-01-05'),
          challengeTypeCode: '122',
        },
        {
          challengeCategory: ChallengeCategory.ATTENTION_ORGANISING_TIME,
          active: true,
          fromALNScreener: false,
          createdAt: new Date('2025-01-05'),
          challengeTypeCode: '122',
        },
      ],
      {
        screeners: [],
        prisonNumber: '',
      },
    )

    // Then
    // Non ALN challenges with the same category should be ordered recency DESC
    expect(groupedChallenges.SENSORY.nonAlnChallenges[0].createdAt).toEqual(new Date('2025-01-03'))
    expect(groupedChallenges.SENSORY.nonAlnChallenges[1].createdAt).toEqual(new Date('2025-01-02'))
    expect(groupedChallenges.SENSORY.nonAlnChallenges[2].createdAt).toEqual(new Date('2025-01-01'))
    expect(groupedChallenges.LITERACY_SKILLS.nonAlnChallenges[0].createdAt).toEqual(new Date('2025-01-05'))

    // Validate that the categories are order alphabetically
    expect(Object.keys(groupedChallenges)).toEqual(['ATTENTION_ORGANISING_TIME', 'LITERACY_SKILLS', 'SENSORY'])
  })

  it('should extract the latest ALN screener challenges', () => {
    // Given
    const screeners = {
      screeners: [
        {
          screenerDate: new Date('2025-01-02'),
          challenges: [
            {
              challengeCategory: 'Health',
              active: true,
              fromALNScreener: false,
              createdAt: new Date('2025-01-02'),
              prisonNumber: '',
              challengeType: { code: '123', description: 'Communication' },
              challengeTypeCode: ChallengeType.COMMUNICATION,
            },
          ],
          strengths: new Array<StrengthResponseDto>(),
        },
        {
          screenerDate: new Date('2025-01-01'),
          challenges: [
            {
              challengeCategory: 'Health',
              active: true,
              fromALNScreener: false,
              createdAt: new Date('2025-01-01'),
              prisonNumber: '',
              challengeType: { code: '123', description: 'Handwriting' },
              challengeTypeCode: ChallengeType.HANDWRITING,
            },
          ],
          strengths: new Array<StrengthResponseDto>(),
        },
      ],
      prisonNumber: '',
    }

    const groupedChallenges = controller.getChallengesByType([], screeners)

    // Then
    expect(groupedChallenges).toEqual({
      Health: {
        alnChallenges: [],
        nonAlnChallenges: [
          {
            active: true,
            challengeCategory: 'Health',
            challengeType: { code: '123', description: 'Communication' },
            challengeTypeCode: 'COMMUNICATION',
            createdAt: new Date('2025-01-02'),
            fromALNScreener: false,
            prisonNumber: '',
          },
        ],
      },
    })
  })
})
