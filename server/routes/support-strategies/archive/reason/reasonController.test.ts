import { Request, Response } from 'express'
import ReasonController from './reasonController'
import SupportStrategyService from '../../../../services/supportStrategyService'
import AuditService from '../../../../services/auditService'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import aValidSupportStrategyResponseDto from '../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/supportStrategyService')

describe('reasonController', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ReasonController(supportStrategyService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })

  const supportStrategyReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const supportStrategyResponseDto = aValidSupportStrategyResponseDto({
    prisonNumber,
    reference: supportStrategyReference,
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
    req.journeyData = { supportStrategyDto: supportStrategyResponseDto }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/support-strategies/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: supportStrategyResponseDto,
      errorRecordingSupportStrategy: false,
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

    const expectedViewTemplate = 'pages/support-strategies/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: supportStrategyResponseDto,
      errorRecordingSupportStrategy: false,
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
    req.body = {
      archiveReason: 'SupportStrategy is not relevant and was recorded in error',
    }
    supportStrategyService.archiveSupportStrategy.mockResolvedValue(null)

    const expectedSupportStrategyDto = {
      ...supportStrategyResponseDto,
      prisonId: 'BXI',
      archiveReason: 'SupportStrategy is not relevant and was recorded in error',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/support-strategies#archived-support-strategies`

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Support strategy moved to History')
    expect(req.journeyData.supportStrategyDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(supportStrategyService.archiveSupportStrategy).toHaveBeenCalledWith(
      username,
      supportStrategyReference,
      expectedSupportStrategyDto,
    )
    expect(auditService.logArchiveSupportStrategy).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          supportStrategyReference,
        },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    req.body = {
      archiveReason: 'SupportStrategy is not relevant and was recorded in error',
    }

    supportStrategyService.archiveSupportStrategy.mockRejectedValue(new Error('Internal Server Error'))

    const expectedSupportStrategyDto = {
      ...supportStrategyResponseDto,
      prisonId: 'BXI',
      archiveReason: 'SupportStrategy is not relevant and was recorded in error',
    }
    const expectedNextRoute = 'reason'

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.supportStrategyDto).toEqual(supportStrategyResponseDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(supportStrategyService.archiveSupportStrategy).toHaveBeenCalledWith(
      username,
      supportStrategyReference,
      expectedSupportStrategyDto,
    )
    expect(auditService.logArchiveSupportStrategy).not.toHaveBeenCalled()
  })
})
