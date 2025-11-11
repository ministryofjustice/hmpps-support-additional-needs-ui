import { Request, Response } from 'express'
import ReasonController from './reasonController'
import StrengthService from '../../../../services/strengthService'
import AuditService from '../../../../services/auditService'
import { aValidStrengthResponseDto } from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/strengthService')

describe('reasonController', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ReasonController(strengthService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })

  const strengthReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const strengthDto = aValidStrengthResponseDto({
    reference: strengthReference,
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
    req.journeyData = { strengthDto }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/strengths/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: strengthDto,
      errorRecordingStrength: false,
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

    const expectedViewTemplate = 'pages/strengths/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: strengthDto,
      errorRecordingStrength: false,
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
    const strengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    req.journeyData = { strengthDto: strengthResponseDto }
    req.body = {
      archiveReason: 'Strength is not relevant and was recorded in error',
    }
    strengthService.archiveStrength.mockResolvedValue(null)

    const expectedStrengthDto = {
      ...strengthResponseDto,
      prisonId: 'BXI',
      archiveReason: 'Strength is not relevant and was recorded in error',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/strengths#archived-strengths`

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Strength moved to History')
    expect(req.journeyData.strengthDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(strengthService.archiveStrength).toHaveBeenCalledWith(username, strengthReference, expectedStrengthDto)
    expect(auditService.logArchiveStrength).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          strengthReference,
        },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const strengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    req.journeyData = { strengthDto: strengthResponseDto }
    req.body = {
      archiveReason: 'Strength is not relevant and was recorded in error',
    }

    strengthService.archiveStrength.mockRejectedValue(new Error('Internal Server Error'))

    const expectedStrengthDto = {
      ...strengthResponseDto,
      prisonId: 'BXI',
      archiveReason: 'Strength is not relevant and was recorded in error',
    }
    const expectedNextRoute = 'reason'

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.strengthDto).toEqual(strengthResponseDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(strengthService.archiveStrength).toHaveBeenCalledWith(username, strengthReference, expectedStrengthDto)
    expect(auditService.logArchiveStrength).not.toHaveBeenCalled()
  })
})
