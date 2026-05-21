import { Request, Response } from 'express'
import type { ScreenerDeletionDto } from 'dto'
import ConfirmController from './confirmController'
import AdditionalLearningNeedsScreenerService from '../../../../services/additionalLearningNeedsScreenerService'
import AuditService from '../../../../services/auditService'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidAlnScreenerResponseDto } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/additionalLearningNeedsScreenerService')

describe('delete/confirm/confirmController (ALN screener)', () => {
  const alnScreenerService = new AdditionalLearningNeedsScreenerService(
    null,
  ) as jest.Mocked<AdditionalLearningNeedsScreenerService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmController(alnScreenerService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const latestScreener = aValidAlnScreenerResponseDto()
  const dto: ScreenerDeletionDto = {
    prisonNumber,
    latestScreener,
    deleteReason: 'ENTERED_IN_ERROR',
    returnTo: `/profile/${prisonNumber}/strengths`,
  }

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: { screenerDeletionDto: dto },
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
    req.journeyData = { screenerDeletionDto: { ...dto } }
    flash.mockReturnValue([])
  })

  describe('getConfirmView', () => {
    it('renders the confirm view with no API error', async () => {
      flash.mockReturnValue([])

      await controller.getConfirmView(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/additional-learning-needs-screener/delete/confirm/index', {
        prisonerSummary,
        dto: req.journeyData.screenerDeletionDto,
        errorDeletingScreener: false,
      })
    })

    it('renders the confirm view with an API error banner when flash is set', async () => {
      flash.mockReturnValue(['true'])

      await controller.getConfirmView(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/additional-learning-needs-screener/delete/confirm/index', {
        prisonerSummary,
        dto: req.journeyData.screenerDeletionDto,
        errorDeletingScreener: true,
      })
    })
  })

  describe('submitConfirmForm', () => {
    it('deletes the latest screener, fires audit, clears journey data, and redirects with success on API success', async () => {
      alnScreenerService.deleteLatestScreener.mockResolvedValue(null)

      await controller.submitConfirmForm(req, res, next)

      expect(alnScreenerService.deleteLatestScreener).toHaveBeenCalledWith(
        username,
        prisonNumber,
        'BXI',
        'ENTERED_IN_ERROR',
      )
      expect(req.journeyData.screenerDeletionDto).toBeUndefined()
      expect(auditService.logDeleteAlnScreener).toHaveBeenCalledWith(
        expect.objectContaining({
          details: {
            screenerReference: latestScreener.reference,
            screenerDate: latestScreener.screenerDate,
          },
          subjectId: prisonNumber,
          subjectType: 'PRISONER_ID',
          who: username,
        }),
      )
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        `/profile/${prisonNumber}/strengths`,
        'Screener results deleted.',
      )
      expect(flash).not.toHaveBeenCalled()
    })

    it('falls back to the overview when returnTo is missing', async () => {
      alnScreenerService.deleteLatestScreener.mockResolvedValue(null)
      const dtoWithoutReturnTo: ScreenerDeletionDto = { prisonNumber, latestScreener, deleteReason: 'ENTERED_IN_ERROR' }
      req.journeyData = { screenerDeletionDto: dtoWithoutReturnTo }

      await controller.submitConfirmForm(req, res, next)

      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        `/profile/${prisonNumber}/overview`,
        'Screener results deleted.',
      )
    })

    it('redirects back to confirm with the API error flash on API failure', async () => {
      alnScreenerService.deleteLatestScreener.mockRejectedValue(new Error('Internal Server Error'))

      await controller.submitConfirmForm(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('confirm')
      expect(req.journeyData.screenerDeletionDto).not.toBeUndefined()
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(auditService.logDeleteAlnScreener).not.toHaveBeenCalled()
      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    })
  })
})
