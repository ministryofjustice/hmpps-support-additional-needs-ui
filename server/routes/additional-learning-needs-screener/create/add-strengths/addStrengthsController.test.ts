import { Request, Response } from 'express'
import { aValidAlnScreenerDto } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'
import AddStrengthsController from './addStrengthsController'
import StrengthType from '../../../../enums/strengthType'

describe('addStrengthsController', () => {
  const controller = new AddStrengthsController()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      alnScreenerDto: aValidAlnScreenerDto({ strengths: [StrengthType.ARITHMETIC, StrengthType.MATHS_CONFIDENCE] }),
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/add-strengths/index'
    const expectedViewModel = {
      form: {
        strengthTypeCodes: ['ARITHMETIC', 'MATHS_CONFIDENCE'],
      },
    }

    // When
    await controller.getAddStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      strengthTypeCodes: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/add-strengths/index'
    const expectedViewModel = { form: invalidForm }

    // When
    await controller.getAddStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form where strengthTypeCodes is not present', async () => {
    // Given
    const invalidForm = {
      strengthTypeCodes: undefined as unknown as string[],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/add-strengths/index'
    const expectedViewModel = { form: { strengthTypeCodes: [] as string[] } }

    // When
    await controller.getAddStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { alnScreenerDto: aValidAlnScreenerDto({ strengths: null }) }
    req.body = {
      strengthTypeCodes: ['ARITHMETIC', 'MATHS_CONFIDENCE'],
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedAlnScreenerDto = aValidAlnScreenerDto({
      strengths: [StrengthType.ARITHMETIC, StrengthType.MATHS_CONFIDENCE],
    })

    // When
    await controller.submitAddStrengthsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = { alnScreenerDto: aValidAlnScreenerDto({ strengths: [StrengthType.NONE] }) }
    req.body = {
      strengthTypeCodes: ['ARITHMETIC', 'MATHS_CONFIDENCE'],
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedAlnScreenerDto = aValidAlnScreenerDto({
      strengths: [StrengthType.ARITHMETIC, StrengthType.MATHS_CONFIDENCE],
    })

    // When
    await controller.submitAddStrengthsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })
})
