import { Request, Response } from 'express'
import SelectCategoryController from './selectCategoryController'
import { aValidStrengthDto } from '../../../../testsupport/strengthDtoTestDataBuilder'

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
      strengthDto: {
        ...aValidStrengthDto(),
        strengthTypeCode: 'MEMORY',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/strengths/select-category/index'
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

    const expectedViewTemplate = 'pages/strengths/select-category/index'
    const expectedViewModel = { form: invalidForm }

    // When
    await controller.getSelectCategoryView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    req.journeyData = {
      strengthDto: {
        ...aValidStrengthDto(),
        strengthTypeCode: null,
      },
    }
    req.body = {
      category: 'MEMORY',
    }

    const expectedNextRoute = 'detail'
    const expectedStrengthDto = {
      ...aValidStrengthDto(),
      strengthTypeCode: 'MEMORY',
    }

    // When
    await controller.submitSelectCategoryForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthDto)
  })
})
