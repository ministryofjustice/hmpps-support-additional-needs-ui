import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import ScreenerDateController from './screenerDateController'
import { aValidAlnScreenerDto } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'

describe('screenerDateController', () => {
  const controller = new ScreenerDateController()

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
      alnScreenerDto: aValidAlnScreenerDto({ screenerDate: parseISO('2025-06-20') }),
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/screener-date/index'
    const expectedViewModel = {
      form: {
        screenerDate: '20/6/2025',
      },
    }

    // When
    await controller.getScreenerDateView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      screenerDate: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/screener-date/index'
    const expectedViewModel = { form: invalidForm }

    // When
    await controller.getScreenerDateView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { alnScreenerDto: aValidAlnScreenerDto({ screenerDate: null }) }
    req.body = {
      screenerDate: '10/6/2025',
    }

    const expectedNextRoute = 'add-challenges'
    const expectedAlnScreenerDto = aValidAlnScreenerDto({ screenerDate: parseISO('2025-06-10') })

    // When
    await controller.submitScreenerDateForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = { alnScreenerDto: aValidAlnScreenerDto({ screenerDate: parseISO('2025-06-09') }) }
    req.body = {
      screenerDate: '10/6/2025',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedAlnScreenerDto = aValidAlnScreenerDto({ screenerDate: parseISO('2025-06-10') })

    // When
    await controller.submitScreenerDateForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })
})
