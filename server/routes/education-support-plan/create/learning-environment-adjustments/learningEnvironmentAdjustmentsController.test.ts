import { Request, Response } from 'express'
import LearningEnvironmentAdjustmentsController from './learningEnvironmentAdjustmentsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'

describe('learningEnvironmentAdjustmentsController', () => {
  const controller = new LearningEnvironmentAdjustmentsController()

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
        learningEnvironmentAdjustmentsNeeded: true,
        learningEnvironmentAdjustments: 'Needs to sit by the door',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/learning-environment-adjustments/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        adjustmentsNeeded: YesNoValue.YES,
        details: 'Needs to sit by the door',
      },
    }

    // When
    await controller.getLearningEnvironmentAdjustmentsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      adjustmentsNeeded: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/learning-environment-adjustments/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getLearningEnvironmentAdjustmentsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      adjustmentsNeeded: YesNoValue.YES,
      details: 'Needs to sit by the door',
    }

    const expectedNextRoute = 'teaching-adjustments'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      learningEnvironmentAdjustmentsNeeded: true,
      learningEnvironmentAdjustments: 'Needs to sit by the door',
    }

    // When
    await controller.submitLearningEnvironmentAdjustmentsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        learningEnvironmentAdjustmentsNeeded: false,
        learningEnvironmentAdjustments: undefined,
      },
    }
    req.body = {
      adjustmentsNeeded: YesNoValue.YES,
      details: 'Needs to sit by the door',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      learningEnvironmentAdjustmentsNeeded: true,
      learningEnvironmentAdjustments: 'Needs to sit by the door',
    }

    // When
    await controller.submitLearningEnvironmentAdjustmentsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
