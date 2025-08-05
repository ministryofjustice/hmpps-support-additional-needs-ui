import { Request, Response } from 'express'
import StrengthsController from './strengthsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidStrengthsList } from '../../../testsupport/strengthDtoTestDataBuilder'
import { Result } from '../../../utils/result/result'

describe('strengthsController', () => {
  const controller = new StrengthsController()

  const prisonerSummary = aValidPrisonerSummary()
  const strengths = Result.fulfilled(aValidStrengthsList())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, strengths },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'
    const expectedViewModel = {
      prisonerSummary,
      strengths,
      tab: 'strengths',
    }

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
