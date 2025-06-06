import { Request, Response } from 'express'
import TeachingAdjustmentsController from './teachingAdjustmentsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'

describe('teachingAdjustmentsController', () => {
  const controller = new TeachingAdjustmentsController()

  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: true,
        teachingAdjustments: 'Use simpler language and examples',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/teaching-adjustments/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        adjustmentsNeeded: YesNoValue.YES,
        details: 'Use simpler language and examples',
      },
    }

    // When
    await controller.getTeachingAdjustmentsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      adjustmentsNeeded: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/teaching-adjustments/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getTeachingAdjustmentsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      adjustmentsNeeded: YesNoValue.YES,
      details: 'Use simpler language and examples',
    }

    const expectedNextRoute = 'specific-teaching-skills'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      teachingAdjustmentsNeeded: true,
      teachingAdjustments: 'Use simpler language and examples',
    }

    // When
    await controller.submitTeachingAdjustmentsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
