import { Request, Response } from 'express'
import ConfirmController from './confirmController'
import ConditionService from '../../../../services/conditionService'
import AuditService from '../../../../services/auditService'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/conditionService')

describe('delete/confirm/confirmController', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmController(conditionService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const conditionReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const conditionDto = aValidConditionDto({
    reference: conditionReference,
    prisonNumber,
    deleteReason: 'ENTERED_IN_ERROR',
  })

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: { conditionDto },
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
    req.journeyData = { conditionDto }
    flash.mockReturnValue([])
  })

  describe('getConfirmView', () => {
    it('should render the confirm view with no API error', async () => {
      // Given
      flash.mockReturnValue([])

      const expectedViewTemplate = 'pages/conditions/delete/confirm/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: conditionDto,
        errorDeletingCondition: false,
      }

      // When
      await controller.getConfirmView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })

    it('should render the confirm view with API error banner when flash is set', async () => {
      // Given
      flash.mockReturnValue(['true'])

      const expectedViewTemplate = 'pages/conditions/delete/confirm/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: conditionDto,
        errorDeletingCondition: true,
      }

      // When
      await controller.getConfirmView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitConfirmForm', () => {
    it('should delete condition, fire audit, clear journey data, and redirect with success on API success', async () => {
      // Given
      conditionService.deleteCondition.mockResolvedValue(null)

      const expectedNextRoute = `/profile/${prisonNumber}/conditions#current-conditions`

      // When
      await controller.submitConfirmForm(req, res, next)

      // Then
      expect(conditionService.deleteCondition).toHaveBeenCalledWith(
        username,
        prisonNumber,
        conditionReference,
        'BXI',
        'ENTERED_IN_ERROR',
      )
      expect(req.journeyData.conditionDto).toBeUndefined()
      expect(auditService.logDeleteCondition).toHaveBeenCalledWith(
        expect.objectContaining({
          details: {
            conditionReference,
            mode: 'active',
          },
          subjectId: prisonNumber,
          subjectType: 'PRISONER_ID',
          who: username,
        }),
      )
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Condition deleted.')
      expect(flash).not.toHaveBeenCalled()
    })

    it('should redirect back to confirm with API error flash on API failure', async () => {
      // Given
      conditionService.deleteCondition.mockRejectedValue(new Error('Internal Server Error'))

      // When
      await controller.submitConfirmForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('confirm')
      expect(req.journeyData.conditionDto).toEqual(conditionDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(auditService.logDeleteCondition).not.toHaveBeenCalled()
      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    })
  })
})
