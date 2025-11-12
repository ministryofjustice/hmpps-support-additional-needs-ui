import { Request, Response } from 'express'
import ReasonController from './reasonController'
import ChallengeService from '../../../../services/challengeService'
import AuditService from '../../../../services/auditService'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/challengeService')

describe('reasonController', () => {
  const challengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ReasonController(challengeService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })

  const challengeReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const challengeDto = aValidChallengeResponseDto({
    reference: challengeReference,
    archiveReason: null,
  })

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
    params: { prisonNumber },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonNamesById,
      user: { username, activeCaseLoadId: 'BXI' },
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = { challengeDto }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/challenges/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: challengeDto,
      errorRecordingChallenge: false,
      form: { archiveReason: '' },
      mode: 'archive',
    }

    // When
    await controller.getReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      archiveReason: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/challenges/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: challengeDto,
      errorRecordingChallenge: false,
      form: invalidForm,
      mode: 'archive',
    }

    // When
    await controller.getReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const challengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    req.journeyData = { challengeDto: challengeResponseDto }
    req.body = {
      archiveReason: 'Challenge is not relevant and was recorded in error',
    }
    challengeService.archiveChallenge.mockResolvedValue(null)

    const expectedChallengeDto = {
      ...challengeResponseDto,
      prisonId: 'BXI',
      archiveReason: 'Challenge is not relevant and was recorded in error',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/challenges#archived-challenges`

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Challenge moved to History')
    expect(req.journeyData.challengeDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(challengeService.archiveChallenge).toHaveBeenCalledWith(username, challengeReference, expectedChallengeDto)
    expect(auditService.logArchiveChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          challengeReference,
        },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const challengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    req.journeyData = { challengeDto: challengeResponseDto }
    req.body = {
      archiveReason: 'Challenge is not relevant and was recorded in error',
    }

    challengeService.archiveChallenge.mockRejectedValue(new Error('Internal Server Error'))

    const expectedChallengeDto = {
      ...challengeResponseDto,
      prisonId: 'BXI',
      archiveReason: 'Challenge is not relevant and was recorded in error',
    }
    const expectedNextRoute = 'reason'

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.challengeDto).toEqual(challengeResponseDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(challengeService.archiveChallenge).toHaveBeenCalledWith(username, challengeReference, expectedChallengeDto)
    expect(auditService.logArchiveChallenge).not.toHaveBeenCalled()
  })
})
