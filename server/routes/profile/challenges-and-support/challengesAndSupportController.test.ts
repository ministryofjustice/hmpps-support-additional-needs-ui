import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import { aValidAlnScreenerList } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengesAndSupportController from './challengesAndSupportController'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../enums/supportStrategyType'

describe('challengesAndSupportController', () => {
  const controller = new ChallengesAndSupportController()

  const prisonerSummary = aValidPrisonerSummary()
  const challenges = Result.fulfilled([aValidChallengeResponseDto()])
  const alnScreeners = Result.fulfilled(aValidAlnScreenerList())
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })
  const educationSupportPlanLifecycleStatus = Result.fulfilled(aPlanLifecycleStatusDto())
  const memorySupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
    active: true,
  })
  const sensorySupportStrategy = aValidSupportStrategyResponseDto({
    supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
    active: false,
  })
  const supportStrategies = Result.fulfilled([memorySupportStrategy, sensorySupportStrategy])

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      challenges,
      alnScreeners,
      supportStrategies,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/challenges-and-support/index'
    const expectedActiveGroupedSupportStrategies = {
      MEMORY: [memorySupportStrategy],
    }
    const expectedArchivedGroupedSupportStrategies = {
      SENSORY: [sensorySupportStrategy],
    }

    const expectedViewModel = {
      prisonNamesById,
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      tab: 'challenges-and-support',
      activeChallenges: expect.objectContaining({
        status: 'fulfilled',
      }),
      archivedChallenges: expect.objectContaining({
        status: 'fulfilled',
      }),
      activeSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedActiveGroupedSupportStrategies,
      }),
      archivedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedArchivedGroupedSupportStrategies,
      }),
    }

    // When
    await controller.getChallengesAndSupportView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
