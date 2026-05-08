import { Request, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import ReasonController from './reasonController'
import SupportStrategyService from '../../../../services/supportStrategyService'
import aValidSupportStrategyResponseDto from '../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/supportStrategyService')

describe('delete/reason/reasonController', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const controller = new ReasonController(supportStrategyService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const supportStrategyReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const supportStrategyDto = aValidSupportStrategyResponseDto({
    reference: supportStrategyReference,
    prisonNumber,
  })

  const req = {
    session: {},
    user: { username },
    journeyData: {},
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
    req.body = {}
    req.journeyData = { supportStrategyDto }
  })

  describe('getReasonView', () => {
    it('should render the reason view with no previously submitted invalid form', async () => {
      res.locals.invalidForm = undefined

      const expectedViewTemplate = 'pages/support-strategies/delete/reason/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: supportStrategyDto,
        form: { deleteReason: '' },
      }

      await controller.getReasonView(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })

    it('should render view given a previously submitted invalid form', async () => {
      const invalidForm = { deleteReason: ['NOT_VALID'] }
      res.locals.invalidForm = invalidForm

      const expectedViewTemplate = 'pages/support-strategies/delete/reason/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: supportStrategyDto,
        form: invalidForm,
      }

      await controller.getReasonView(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitReasonForm', () => {
    it('should store deleteReason on the DTO and redirect to review', async () => {
      req.body = { deleteReason: 'ENTERED_IN_ERROR' }

      await controller.submitReasonForm(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('review')
      expect((req.journeyData.supportStrategyDto as SupportStrategyResponseDto).deleteReason).toEqual(
        'ENTERED_IN_ERROR',
      )
    })
  })
})
