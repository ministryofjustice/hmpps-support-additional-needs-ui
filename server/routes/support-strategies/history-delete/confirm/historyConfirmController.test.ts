import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import HistoryConfirmController from './historyConfirmController'
import SupportStrategyService from '../../../../services/supportStrategyService'
import AuditService from '../../../../services/auditService'
import aValidSupportStrategyResponseDto from '../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/supportStrategyService')

describe('history-delete/confirm/historyConfirmController', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new HistoryConfirmController(supportStrategyService, auditService)

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

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: { supportStrategyDto },
    body: {},
    params: { prisonNumber },
    flash,
    id: 'some-correlation-id',
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      user: { username, activeCaseLoadId: 'BXI' },
      apiErrorCallback: jest.fn(),
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = { supportStrategyDto }
    flash.mockReturnValue([])
  })

  describe('getConfirmView', () => {
    it('should render the confirm view with mode: history', async () => {
      flash.mockReturnValue([])

      const expectedViewTemplate = 'pages/support-strategies/delete/confirm/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'history',
        dto: supportStrategyDto,
      }

      await controller.getConfirmView(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitConfirmForm', () => {
    it('should delete history support strategy, fire audit with mode: history, clear journey data, and redirect with success', async () => {
      supportStrategyService.deleteSupportStrategy.mockResolvedValue(null)

      const expectedNextRoute = `/profile/${prisonNumber}/support-strategies#archived-support-strategies`

      await controller.submitConfirmForm(req, res, next)

      expect(supportStrategyService.deleteSupportStrategy).toHaveBeenCalledWith(
        username,
        prisonNumber,
        supportStrategyReference,
        'BXI',
        DeleteReason.ENTERED_IN_ERROR,
      )
      expect(req.journeyData.supportStrategyDto).toBeUndefined()
      expect(auditService.logDeleteSupportStrategy).toHaveBeenCalledWith(
        expect.objectContaining({
          details: {
            supportStrategyReference,
            mode: 'history',
          },
          subjectId: prisonNumber,
          subjectType: 'PRISONER_ID',
          who: username,
        }),
      )
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'History support strategy deleted.')
      expect(flash).not.toHaveBeenCalled()
    })

    it('should redirect back to confirm with API error flash on API failure', async () => {
      supportStrategyService.deleteSupportStrategy.mockRejectedValue(new Error('Internal Server Error'))

      await controller.submitConfirmForm(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('confirm')
      expect(req.journeyData.supportStrategyDto).toEqual(supportStrategyDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(auditService.logDeleteSupportStrategy).not.toHaveBeenCalled()
      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    })
  })
})
