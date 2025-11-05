import { Request, Response } from 'express'
import DetailController from './detailController'
import SupportStrategyType from '../../../../enums/supportStrategyType'
import SupportStrategyService from '../../../../services/supportStrategyService'
import AuditService from '../../../../services/auditService'
import aValidSupportStrategyResponseDto from '../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'

jest.mock('../../../../services/supportStrategyService')
jest.mock('../../../../services/auditService')

describe('detailController', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new DetailController(supportStrategyService, auditService)

  const username = 'A_USER'
  const prisonId = 'MDI'
  const prisonNumber = 'A1234BC'
  const supportStrategyReference = '518d65dc-2866-46a7-94c0-ffb331e66061'

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
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { user: { username, activeCaseLoadId: 'MDI' } },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      supportStrategyDto: aValidSupportStrategyResponseDto({
        details: 'John can read and understand written language very well',
      }),
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/support-strategies/detail/edit-journey/index'
    const expectedViewModel = {
      category: SupportStrategyType.MEMORY,
      form: {
        description: 'John can read and understand written language very well',
      },
      mode: 'edit',
      errorRecordingSupportStrategy: false,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      description: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/support-strategies/detail/edit-journey/index'
    const expectedViewModel = {
      category: SupportStrategyType.MEMORY,
      form: invalidForm,
      mode: 'edit',
      errorRecordingSupportStrategy: false,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/support-strategies/detail/edit-journey/index'
    const expectedViewModel = {
      category: SupportStrategyType.MEMORY,
      form: {
        description: 'John can read and understand written language very well',
      },
      mode: 'edit',
      errorRecordingSupportStrategy: true,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const supportStrategyResponseDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })
    req.journeyData = { supportStrategyDto: supportStrategyResponseDto }

    req.body = { description: 'A description of the support strategy' }

    supportStrategyService.updateSupportStrategy.mockResolvedValue(null)

    const expectedSupportStrategyDto = {
      ...supportStrategyResponseDto,
      prisonId,
      supportStrategyDetails: 'A description of the support strategy',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/support-strategies`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Support strategy updated')
    expect(req.journeyData.supportStrategyDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(supportStrategyService.updateSupportStrategy).toHaveBeenCalledWith(
      username,
      supportStrategyReference,
      expectedSupportStrategyDto,
    )
    expect(auditService.logEditSupportStrategy).toHaveBeenCalledWith(
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
    const supportStrategyResponseDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })
    req.journeyData = { supportStrategyDto: supportStrategyResponseDto }

    req.body = { description: 'A description of the support strategy' }

    supportStrategyService.updateSupportStrategy.mockRejectedValue(new Error('Internal Server Error'))

    const expectedSupportStrategyDto = {
      ...supportStrategyResponseDto,
      prisonId,
      supportStrategyDetails: 'A description of the support strategy',
    }
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.supportStrategyDto).toEqual(supportStrategyResponseDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(supportStrategyService.updateSupportStrategy).toHaveBeenCalledWith(
      username,
      supportStrategyReference,
      expectedSupportStrategyDto,
    )
    expect(auditService.logEditSupportStrategy).not.toHaveBeenCalled()
  })
})
