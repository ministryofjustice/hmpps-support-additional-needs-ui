import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { aValidStrengthsList } from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import { aValidAlnScreenerList } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'
import ReviewExistingStrengthsController from './reviewExistingStrengthsController'

describe('reviewExistingStrengthsController', () => {
  const controller = new ReviewExistingStrengthsController()

  const prisonerSummary = aValidPrisonerSummary()

  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }

  const strengths = Result.fulfilled(aValidStrengthsList())
  const alnScreeners = Result.fulfilled(aValidAlnScreenerList())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: { prisonerSummary, strengths, alnScreeners, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/strengths/index'

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      groupedStrengths: expect.objectContaining({
        status: 'fulfilled',
      }),
      mode: 'review',
    })

    // When
    await controller.getReviewExistingStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'challenges'

    // When
    await controller.submitReviewExistingStrengthsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
