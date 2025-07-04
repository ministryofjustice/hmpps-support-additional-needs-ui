import { Request, Response } from 'express'
import ReviewNeedsConditionsStrengthsController from './reviewNeedsConditionsStrengthsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('reviewNeedsConditionsStrengthsController', () => {
  const controller = new ReviewNeedsConditionsStrengthsController()

  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
  })

  it('should render view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/review-needs-conditions-strengths/index'
    const expectedViewModel = { prisonerSummary }

    // When
    await controller.getReviewNeedsConditionsStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'individual-support-requirements'

    // When
    await controller.submitReviewNeedsConditionsStrengthsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
