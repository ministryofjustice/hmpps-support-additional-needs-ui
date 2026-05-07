import { Request, Response } from 'express'
import type { ConditionDto } from 'dto'
import ReasonController from './reasonController'
import ConditionService from '../../../../services/conditionService'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/conditionService')

describe('delete/reason/reasonController', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const controller = new ReasonController(conditionService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const conditionReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const conditionDto = aValidConditionDto({
    reference: conditionReference,
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
    req.journeyData = { conditionDto }
  })

  describe('getReasonView', () => {
    it('should render the reason view with no previously submitted invalid form', async () => {
      // Given
      res.locals.invalidForm = undefined

      const expectedViewTemplate = 'pages/conditions/delete/reason/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: conditionDto,
        form: { deleteReason: '' },
      }

      // When
      await controller.getReasonView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })

    it('should render view given a previously submitted invalid form', async () => {
      // Given
      const invalidForm = { deleteReason: ['NOT_VALID'] }
      res.locals.invalidForm = invalidForm

      const expectedViewTemplate = 'pages/conditions/delete/reason/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: conditionDto,
        form: invalidForm,
      }

      // When
      await controller.getReasonView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitReasonForm', () => {
    it('should store deleteReason on the DTO and redirect to review', async () => {
      // Given
      req.body = { deleteReason: 'ENTERED_IN_ERROR' }

      // When
      await controller.submitReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('review')
      expect((req.journeyData.conditionDto as ConditionDto).deleteReason).toEqual('ENTERED_IN_ERROR')
    })
  })
})
