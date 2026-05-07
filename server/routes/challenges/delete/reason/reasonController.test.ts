import { Request, Response } from 'express'
import type { ChallengeResponseDto } from 'dto'
import ReasonController from './reasonController'
import ChallengeService from '../../../../services/challengeService'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../../../services/challengeService')

describe('delete/reason/reasonController', () => {
  const challengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const controller = new ReasonController(challengeService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const challengeReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const challengeDto = aValidChallengeResponseDto({
    reference: challengeReference,
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
    req.journeyData = { challengeDto }
  })

  describe('getReasonView', () => {
    it('should render the reason view with no previously submitted invalid form', async () => {
      // Given
      res.locals.invalidForm = undefined

      const expectedViewTemplate = 'pages/challenges/delete/reason/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: challengeDto,
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

      const expectedViewTemplate = 'pages/challenges/delete/reason/index'
      const expectedViewModel = {
        prisonerSummary,
        mode: 'active',
        dto: challengeDto,
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
      expect((req.journeyData.challengeDto as ChallengeResponseDto).deleteReason).toEqual('ENTERED_IN_ERROR')
    })
  })
})
