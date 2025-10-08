import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import aValidSupportStrategyDto from '../../../../testsupport/supportStrategyDtoTestDataBuilder'
import ReviewExistingSupportStrategiesController from './reviewExistingSupportStrategiesController'

describe('reviewExistingSupportStrategiesController', () => {
  const controller = new ReviewExistingSupportStrategiesController()

  const prisonerSummary = aValidPrisonerSummary()

  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }

  const supportStrategies = Result.fulfilled([aValidSupportStrategyDto()])

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: { prisonerSummary, supportStrategies, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/support-strategies/index'
    const expectedGroupedSupportStrategies = {
      MEMORY: [
        {
          prisonId: 'BXI',
          prisonNumber: 'A1234BC',
          supportStrategyDetails: 'Using flash cards with John can help him retain facts',
          supportStrategyTypeCode: 'MEMORY',
        },
      ],
    }
    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      supportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
      mode: 'review',
    })

    // When
    await controller.getReviewExistingSupportStrategiesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = '../teaching-adjustments'

    // When
    await controller.submitReviewExistingSupportStrategiesForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
