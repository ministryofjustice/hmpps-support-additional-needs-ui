import { Request, Response } from 'express'
import SelectCategoryController from './selectCategoryController'
import aValidSupportStrategyDto from '../../../../testsupport/supportStrategyDtoTestDataBuilder'

describe('selectCategoryController', () => {
  const controller = new SelectCategoryController()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
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
        supportStrategyTypeCode: 'MEMORY',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/support-strategies/select-category/index'
    const expectedViewModel = {
      form: {
        category: 'MEMORY',
      },
    }

    // When
    await controller.getSelectCategoryView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      category: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/support-strategies/select-category/index'
    const expectedViewModel = { form: invalidForm }

    // When
    await controller.getSelectCategoryView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    req.journeyData = {
      supportStrategyDto: {
        ...aValidSupportStrategyDto(),
        supportStrategyTypeCode: null,
      },
    }
    req.body = {
      category: 'MEMORY',
    }

    const expectedNextRoute = 'detail'
    const expectedSupportStrategyDto = {
      ...aValidSupportStrategyDto(),
      supportStrategyTypeCode: 'MEMORY',
    }

    // When
    await controller.submitSelectCategoryForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyDto)
  })
})
