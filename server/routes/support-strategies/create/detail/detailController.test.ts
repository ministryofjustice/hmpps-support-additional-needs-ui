import { Request, Response } from 'express'
import DetailController from './detailController'
import aValidSupportStrategyDto from '../../../../testsupport/supportStrategyDtoTestDataBuilder'
import SupportStrategyType from '../../../../enums/supportStrategyType'

describe('detailController', () => {
  const controller = new DetailController()

  const username = 'A_USER'

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
})
