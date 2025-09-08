import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import ReviewExistingConditionsController from './reviewExistingConditionsController'
import { aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'

describe('reviewExistingConditionsController', () => {
  const controller = new ReviewExistingConditionsController()

  const prisonerSummary = aValidPrisonerSummary()
  const conditions = Result.fulfilled(aValidConditionsList())
  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: { prisonerSummary, prisonNamesById, conditions },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/conditions/index'

    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      conditions,
    }

    // When
    await controller.getReviewExistingConditionsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'support-strategies'

    // When
    await controller.submitReviewExistingConditionsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
