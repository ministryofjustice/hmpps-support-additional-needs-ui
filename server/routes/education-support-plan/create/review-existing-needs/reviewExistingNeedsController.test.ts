import { Request, Response } from 'express'
import ReviewExistingNeedsController from './reviewExistingNeedsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('reviewExistingNeedsController', () => {
  const controller = new ReviewExistingNeedsController()

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
    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/index'
    const expectedViewModel = { prisonerSummary }

    // When
    await controller.getReviewExistingNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'individual-support-requirements'

    // When
    await controller.submitReviewExistingNeedsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
