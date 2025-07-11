import { Request, Response } from 'express'
import SupportStrategiesController from './supportStrategiesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('supportStrategiesController', () => {
  const controller = new SupportStrategiesController()

  const prisonerSummary = aValidPrisonerSummary()

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary },
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
      tab: 'support-strategies',
    }

    // When
    await controller.getSupportStrategiesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
