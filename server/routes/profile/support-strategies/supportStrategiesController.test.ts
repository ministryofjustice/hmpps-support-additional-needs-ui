import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import SupportStrategiesController, { GroupedSupportStrategies } from './supportStrategiesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../enums/supportStrategyType'

describe('supportStrategiesController', () => {
  const controller = new SupportStrategiesController()

  const prisonerSummary = aValidPrisonerSummary()
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })
  const supportStrategies = Result.fulfilled([aValidSupportStrategyResponseDto()])
  const render = jest.fn()

  const req = {} as unknown as Request
  const res = {
    render,
    locals: { prisonerSummary, supportStrategies, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/support-strategies/index'
    const expectedGroupedSupportStrategies: GroupedSupportStrategies = {
      MEMORY: [aValidSupportStrategyResponseDto()],
    }
    const expectedViewModel = {
      prisonNamesById,
      prisonerSummary,
      supportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
      tab: 'support-strategies',
    }

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
  it('should render the view given the support strategies promises are fulfilled', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/support-strategies/index'
    res.locals.supportStrategies = Result.fulfilled([
      aValidSupportStrategyResponseDto({
        supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
        updatedAt: parseISO('2024-01-01T00:00:00'),
        updatedByDisplayName: 'John Smith',
        updatedAtPrison: 'BXI',
        active: true,
        details: 'Uses audio books and text-to-speech software',
      }),
      aValidSupportStrategyResponseDto({
        supportStrategyCategoryTypeCode: SupportStrategyType.NUMERACY_SKILLS_DEFAULT,
        details: 'Requires additional time for mathematical tasks',
        updatedAt: parseISO('2024-01-02T00:00:00'),
        updatedByDisplayName: 'Jane Doe',
        updatedAtPrison: 'LEI',
        active: true,
      }),
    ])

    const expectedGroupedSupportStrategies: GroupedSupportStrategies = {
      LITERACY_SKILLS_DEFAULT: [
        aValidSupportStrategyResponseDto({
          supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
          updatedAt: parseISO('2024-01-01T00:00:00'),
          updatedByDisplayName: 'John Smith',
          updatedAtPrison: 'BXI',
          active: true,
          details: 'Uses audio books and text-to-speech software',
        }),
      ],
      NUMERACY_SKILLS_DEFAULT: [
        aValidSupportStrategyResponseDto({
          supportStrategyCategoryTypeCode: SupportStrategyType.NUMERACY_SKILLS_DEFAULT,
          details: 'Requires additional time for mathematical tasks',
          updatedAt: parseISO('2024-01-02T00:00:00'),
          updatedByDisplayName: 'Jane Doe',
          updatedAtPrison: 'LEI',
          active: true,
        }),
      ],
    }

    const expectedCategoryOrder = ['LITERACY_SKILLS_DEFAULT', 'NUMERACY_SKILLS_DEFAULT']

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      tab: 'support-strategies',
      supportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
    })

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    const actualGroupedSupportStrategies = render.mock.calls[0][1].supportStrategies.value
    const actualCategoryOrder = Object.keys(actualGroupedSupportStrategies)
    expect(actualCategoryOrder).toEqual(expectedCategoryOrder)
  })

  it('should render the view given the support strategies promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/support-strategies/index'

    res.locals.supportStrategies = Result.rejected(new Error('Some error retrieving support strategies'))
    const expectedError = new Error('Some error retrieving support strategies')

    const expectedViewModel = {
      prisonNamesById,
      prisonerSummary,
      supportStrategies: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      tab: 'support-strategies',
    }

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
