import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import ConfirmController from './confirmController'
import StrengthService from '../../../../services/strengthService'
import AuditService from '../../../../services/auditService'
import { aValidStrengthResponseDto } from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/strengthService')

describe('delete/confirm/confirmController', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmController(strengthService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const strengthReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const strengthDto = aValidStrengthResponseDto({
    reference: strengthReference,
    prisonNumber,
    deleteReason: DeleteReason.ENTERED_IN_ERROR,
  })

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: { strengthDto },
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
    req.journeyData = { strengthDto }
    flash.mockReturnValue([])
  })

  describe('getConfirmView', () => {
    it('should render the confirm view', async () => {
      // Given
      flash.mockReturnValue([])

      const expectedViewTemplate = 'pages/strengths/delete/confirm/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: strengthDto,
      }

      // When
      await controller.getConfirmView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitConfirmForm', () => {
    it('should delete strength, fire audit, clear journey data, and redirect with success on API success', async () => {
      // Given
      strengthService.deleteStrength.mockResolvedValue(null)

      const expectedNextRoute = `/profile/${prisonNumber}/strengths#current-strengths`

      // When
      await controller.submitConfirmForm(req, res, next)

      // Then
      expect(strengthService.deleteStrength).toHaveBeenCalledWith(
        username,
        prisonNumber,
        strengthReference,
        'BXI',
        DeleteReason.ENTERED_IN_ERROR,
      )
      expect(req.journeyData.strengthDto).toBeUndefined()
      expect(auditService.logDeleteStrength).toHaveBeenCalledWith(
        expect.objectContaining({
          details: {
            strengthReference,
            mode: 'active',
          },
          subjectId: prisonNumber,
          subjectType: 'PRISONER_ID',
          who: username,
        }),
      )
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Strength deleted.')
      expect(flash).not.toHaveBeenCalled()
    })

    it('should redirect back to confirm with API error flash on API failure', async () => {
      // Given
      strengthService.deleteStrength.mockRejectedValue(new Error('Internal Server Error'))

      // When
      await controller.submitConfirmForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('confirm')
      expect(req.journeyData.strengthDto).toEqual(strengthDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(auditService.logDeleteStrength).not.toHaveBeenCalled()
      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    })
  })
})
