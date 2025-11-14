import { Request, Response } from 'express'
import SupportStrategiesController from './supportStrategiesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import SupportStrategyType from '../../../enums/supportStrategyType'

describe('supportStrategiesController', () => {
  const controller = new SupportStrategiesController()

  const prisonerSummary = aValidPrisonerSummary()
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
    locals: { prisonerSummary, supportStrategies, prisonNamesById, educationSupportPlanLifecycleStatus },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/support-strategies/index'
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
      activeSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedActiveGroupedSupportStrategies,
      }),
      archivedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedArchivedGroupedSupportStrategies,
      }),
      tab: 'support-strategies',
    }

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the support strategies promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/support-strategies/index'

    res.locals.supportStrategies = Result.rejected(new Error('Some error retrieving support strategies'))
    const expectedError = new Error('Some error retrieving support strategies')

    const expectedViewModel = {
      prisonNamesById,
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      activeSupportStrategies: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      archivedSupportStrategies: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      tab: 'support-strategies',
    }

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
