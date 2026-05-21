import { Request, Response } from 'express'
import DeleteReason from '../../../../enums/deleteReason'
import ConfirmController from './confirmController'
import ChallengeService from '../../../../services/challengeService'
import AuditService from '../../../../services/auditService'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/challengeService')

describe('delete/confirm/confirmController', () => {
  const challengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmController(challengeService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const challengeReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const challengeDto = aValidChallengeResponseDto({
    reference: challengeReference,
    prisonNumber,
    deleteReason: DeleteReason.ENTERED_IN_ERROR,
  })

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: { challengeDto },
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
    req.journeyData = { challengeDto }
    flash.mockReturnValue([])
  })

  describe('getConfirmView', () => {
    it('should render the confirm view', async () => {
      // Given
      flash.mockReturnValue([])

      const expectedViewTemplate = 'pages/challenges/delete/confirm/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: challengeDto,
      }

      // When
      await controller.getConfirmView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitConfirmForm', () => {
    it('should delete challenge, fire audit, clear journey data, and redirect with success on API success', async () => {
      // Given
      challengeService.deleteChallenge.mockResolvedValue(null)

      const expectedNextRoute = `/profile/${prisonNumber}/challenges#current-challenges`

      // When
      await controller.submitConfirmForm(req, res, next)

      // Then
      expect(challengeService.deleteChallenge).toHaveBeenCalledWith(
        username,
        prisonNumber,
        challengeReference,
        'BXI',
        DeleteReason.ENTERED_IN_ERROR,
      )
      expect(req.journeyData.challengeDto).toBeUndefined()
      expect(auditService.logDeleteChallenge).toHaveBeenCalledWith(
        expect.objectContaining({
          details: {
            challengeReference,
            mode: 'active',
          },
          subjectId: prisonNumber,
          subjectType: 'PRISONER_ID',
          who: username,
        }),
      )
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Challenge deleted.')
      expect(flash).not.toHaveBeenCalled()
    })

    it('should redirect back to confirm with API error flash on API failure', async () => {
      // Given
      challengeService.deleteChallenge.mockRejectedValue(new Error('Internal Server Error'))

      // When
      await controller.submitConfirmForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('confirm')
      expect(req.journeyData.challengeDto).toEqual(challengeDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(auditService.logDeleteChallenge).not.toHaveBeenCalled()
      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    })
  })
})
