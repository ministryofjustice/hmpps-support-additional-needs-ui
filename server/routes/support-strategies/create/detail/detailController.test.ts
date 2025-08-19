import { Request, Response } from 'express'
import DetailController from './detailController'
import aValidSupportStrategyDto from '../../../../testsupport/supportStrategyDtoTestDataBuilder'
import SupportStrategyType from '../../../../enums/supportStrategyType'
import SupportStrategyService from '../../../../services/supportStrategyService'

jest.mock('../../../../services/supportStrategyService')

describe('detailController', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const controller = new DetailController(supportStrategyService)

  const username = 'A_USER'
  const prisonId = 'MDI'
  const prisonNumber = 'A1234BC'

  const flash = jest.fn()

  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      supportStrategyDto: {
        ...aValidSupportStrategyDto(),
        supportStrategyDetails: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/support-strategies/detail/index'
    const expectedViewModel = {
      category: SupportStrategyType.MEMORY,
      form: {
        description: undefined as string,
      },
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
      howIdentified: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/support-strategies/detail/index'
    const expectedViewModel = {
      category: SupportStrategyType.MEMORY,
      form: invalidForm,
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

    const expectedViewTemplate = 'pages/support-strategies/detail/index'
    const expectedViewModel = {
      category: SupportStrategyType.MEMORY,
      form: {
        description: undefined as string,
      },
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
    const supportStrategyDto = aValidSupportStrategyDto({
      prisonNumber,
      prisonId,
      supportStrategyTypeCode: SupportStrategyType.MEMORY,
      supportStrategyDetails: null,
    })
    req.journeyData = { supportStrategyDto }

    req.body = { description: 'A description of the support strategy' }

    supportStrategyService.createSupportStrategies.mockResolvedValue(null)

    const expectedSupportStrategyDto = aValidSupportStrategyDto({
      prisonNumber,
      prisonId,
      supportStrategyTypeCode: SupportStrategyType.MEMORY,
      supportStrategyDetails: 'A description of the support strategy',
    })
    const expectedNextRoute = `/profile/${prisonNumber}/support-strategies`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.supportStrategyDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(supportStrategyService.createSupportStrategies).toHaveBeenCalledWith(username, [expectedSupportStrategyDto])
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const supportStrategyDto = aValidSupportStrategyDto({
      prisonNumber,
      prisonId,
      supportStrategyTypeCode: SupportStrategyType.MEMORY,
      supportStrategyDetails: null,
    })
    req.journeyData = { supportStrategyDto }

    req.body = { description: 'A description of the support strategy' }

    supportStrategyService.createSupportStrategies.mockRejectedValue(new Error('Internal Server Error'))

    const expectedSupportStrategyDto = aValidSupportStrategyDto({
      prisonNumber,
      prisonId,
      supportStrategyTypeCode: SupportStrategyType.MEMORY,
      supportStrategyDetails: 'A description of the support strategy',
    })
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.supportStrategyDto).toEqual(supportStrategyDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(supportStrategyService.createSupportStrategies).toHaveBeenCalledWith(username, [expectedSupportStrategyDto])
  })
})
