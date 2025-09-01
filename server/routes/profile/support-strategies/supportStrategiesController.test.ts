import { Request, Response } from 'express'
import SupportStrategiesController from './supportStrategiesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidSupportStrategyResponse } from '../../../testsupport/supportStrategyResponseTestDataBuilder'

describe('supportStrategiesController', () => {
  const controller = new SupportStrategiesController()

  const prisonerSummary = aValidPrisonerSummary()
  const supportStrategies = [aValidSupportStrategyResponse()]

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, supportStrategies },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/support-strategies/index'
    const expectedViewModel = {
      prisonerSummary,
      supportStrategies,
      tab: 'support-strategies',
    }

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
