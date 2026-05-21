import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import HistoryReviewController from './historyReviewController'
import ConditionService from '../../../../services/conditionService'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/conditionService')

describe('history-delete/review/historyReviewController', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const controller = new HistoryReviewController(conditionService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const conditionReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const conditionDto = aValidConditionDto({
    reference: conditionReference,
    prisonNumber,
    active: false,
    deleteReason: DeleteReason.ENTERED_IN_ERROR,
  })

  const req = {
    session: {},
    user: { username },
    journeyData: { conditionDto },
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
    it('should render the review view with mode: history and the condition DTO', async () => {
      // Given
      const expectedViewTemplate = 'pages/conditions/delete/review/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'history',
        dto: conditionDto,
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
