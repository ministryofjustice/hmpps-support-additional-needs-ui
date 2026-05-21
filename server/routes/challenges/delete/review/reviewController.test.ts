import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import ReviewController from './reviewController'
import ChallengeService from '../../../../services/challengeService'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/challengeService')

describe('delete/review/reviewController', () => {
  const challengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const controller = new ReviewController(challengeService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const challengeReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const challengeDto = aValidChallengeResponseDto({
    reference: challengeReference,
    prisonNumber,
    deleteReason: DeleteReason.ENTERED_IN_ERROR,
  })

  const req = {
    session: {},
    user: { username },
    journeyData: { challengeDto },
    body: {},
    params: { prisonNumber },
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      user: { username, activeCaseLoadId: 'BXI' },
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getReviewView', () => {
    it('should render the review view with the challenge DTO', async () => {
      // Given
      const expectedViewTemplate = 'pages/challenges/delete/review/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: challengeDto,
      }

      // When
      await controller.getReviewView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitReviewForm', () => {
    it('should redirect to confirm', async () => {
      // When
      await controller.submitReviewForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('confirm')
    })
  })
})
