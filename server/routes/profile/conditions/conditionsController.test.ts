import { Request, Response } from 'express'
import ConditionsController from './conditionsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('conditionsController', () => {
  const controller = new ConditionsController()

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
    const expectedViewTemplate = 'pages/profile/conditions/index'
    const expectedViewModel = {
      prisonerSummary,
      tab: 'conditions',
    }

    // When
    await controller.getConditionsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
