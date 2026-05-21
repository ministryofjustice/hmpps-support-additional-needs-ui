import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import HistoryReviewController from './historyReviewController'
import StrengthService from '../../../../services/strengthService'
import { aValidStrengthResponseDto } from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/strengthService')

describe('history-delete/review/historyReviewController', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const controller = new HistoryReviewController(strengthService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const strengthReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const strengthDto = aValidStrengthResponseDto({
    reference: strengthReference,
    prisonNumber,
    deleteReason: DeleteReason.ENTERED_IN_ERROR,
  })

  const req = {
    session: {},
    user: { username },
    journeyData: { strengthDto },
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
    it('should render the review view with mode: history and the strength DTO', async () => {
      // Given
      const expectedViewTemplate = 'pages/strengths/delete/review/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'history',
        dto: strengthDto,
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
