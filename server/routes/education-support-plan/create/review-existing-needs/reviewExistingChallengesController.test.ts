import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { aValidAlnScreenerList } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'
import ReviewExistingChallengesController from './reviewExistingChallengesController'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'

describe('reviewExistingChallengesController', () => {
  const controller = new ReviewExistingChallengesController()

  const prisonerSummary = aValidPrisonerSummary()

  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }

  const challenges = Result.fulfilled([aValidChallengeResponseDto()])
  const alnScreeners = Result.fulfilled(aValidAlnScreenerList())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: { prisonerSummary, challenges, alnScreeners, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/challenges/index'

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      groupedChallenges: expect.objectContaining({
        status: 'fulfilled',
      }),
    })

    // When
    await controller.getReviewExistingChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'conditions'

    // When
    await controller.submitReviewExistingChallengesForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
