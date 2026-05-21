import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import HistoryReviewController from './historyReviewController'
import SupportStrategyService from '../../../../services/supportStrategyService'
import aValidSupportStrategyResponseDto from '../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/supportStrategyService')

describe('history-delete/review/historyReviewController', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const controller = new HistoryReviewController(supportStrategyService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const supportStrategyReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const supportStrategyDto = aValidSupportStrategyResponseDto({
    reference: supportStrategyReference,
    prisonNumber,
    active: false,
    deleteReason: DeleteReason.ENTERED_IN_ERROR,
  })

  const req = {
    session: {},
    user: { username },
    journeyData: { supportStrategyDto },
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
    it('should render the review view with mode: history and the support strategy DTO', async () => {
      const expectedViewTemplate = 'pages/support-strategies/delete/review/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'history',
        dto: supportStrategyDto,
      }

      await controller.getReviewView(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitReviewForm', () => {
    it('should redirect to confirm', async () => {
      await controller.submitReviewForm(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('confirm')
    })
  })
})
