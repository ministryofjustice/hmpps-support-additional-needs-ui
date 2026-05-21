import { Request, Response } from 'express'
import type { ScreenerDeletionDto } from 'dto'
import ReasonController from './reasonController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidAlnScreenerResponseDto } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'

describe('delete/reason/reasonController (ALN screener)', () => {
  const controller = new ReasonController()

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const latestScreener = aValidAlnScreenerResponseDto()

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    next = jest.fn()
    req = {
      session: {},
      user: { username },
      journeyData: {
        screenerDeletionDto: { prisonNumber, latestScreener } as ScreenerDeletionDto,
      },
      body: {},
      params: { prisonNumber },
      query: {},
      flash: jest.fn(),
    } as unknown as Request
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
      locals: {
        prisonerSummary,
        user: { username, activeCaseLoadId: 'BXI' },
      },
    } as unknown as Response
  })

  describe('getReasonView', () => {
    it('renders the reason view with no previously submitted invalid form', async () => {
      res.locals.invalidForm = undefined

      await controller.getReasonView(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/additional-learning-needs-screener/delete/reason/index', {
        prisonerSummary,
        dto: { prisonNumber, latestScreener, returnTo: `/profile/${prisonNumber}/overview` },
        form: { deleteReason: '' },
      })
    })

    it('renders the view with the previously submitted invalid form values', async () => {
      const invalidForm = { deleteReason: ['NOT_VALID'] }
      res.locals.invalidForm = invalidForm

      await controller.getReasonView(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/additional-learning-needs-screener/delete/reason/index', {
        prisonerSummary,
        dto: { prisonNumber, latestScreener, returnTo: `/profile/${prisonNumber}/overview` },
        form: invalidForm,
      })
    })

    it('captures returnTo as the Strengths overview when ?from=strengths', async () => {
      req.query = { from: 'strengths' }

      await controller.getReasonView(req, res, next)

      const renderedDto = (res.render as jest.Mock).mock.calls[0][1].dto as ScreenerDeletionDto
      expect(renderedDto.returnTo).toEqual(`/profile/${prisonNumber}/strengths`)
    })

    it('captures returnTo as the Challenges overview when ?from=challenges', async () => {
      req.query = { from: 'challenges' }

      await controller.getReasonView(req, res, next)

      const renderedDto = (res.render as jest.Mock).mock.calls[0][1].dto as ScreenerDeletionDto
      expect(renderedDto.returnTo).toEqual(`/profile/${prisonNumber}/challenges`)
    })

    it('does not overwrite returnTo once it has been set', async () => {
      ;(req.journeyData.screenerDeletionDto as ScreenerDeletionDto).returnTo = `/profile/${prisonNumber}/strengths`
      req.query = { from: 'challenges' }

      await controller.getReasonView(req, res, next)

      const renderedDto = (res.render as jest.Mock).mock.calls[0][1].dto as ScreenerDeletionDto
      expect(renderedDto.returnTo).toEqual(`/profile/${prisonNumber}/strengths`)
    })
  })

  describe('submitReasonForm', () => {
    it('stores deleteReason on the DTO and redirects to review', async () => {
      req.body = { deleteReason: 'ENTERED_IN_ERROR' }

      await controller.submitReasonForm(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('review')
      expect((req.journeyData.screenerDeletionDto as ScreenerDeletionDto).deleteReason).toEqual('ENTERED_IN_ERROR')
    })
  })
})
