import { Request, Response } from 'express'
import TeachingAdjustmentsController from './teachingAdjustmentsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

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
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: undefined,
        teachingAdjustments: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form and review DTO does not have an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: true,
        teachingAdjustments: 'Use simpler language and examples',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: undefined,
        teachingAdjustments: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/teaching-adjustments/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        adjustmentsNeeded: YesNoValue.YES,
        details: 'Use simpler language and examples',
      },
      mode: 'review',
      currentAnswer: 'Use simpler language and examples',
    }

    // When
    await controller.getTeachingAdjustmentsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given no previously submitted invalid form and review DTO already has an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: true,
        teachingAdjustments: 'Use simpler language and examples',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: false,
        teachingAdjustments: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/teaching-adjustments/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        adjustmentsNeeded: YesNoValue.NO,
        details: undefined as string,
      },
      mode: 'review',
      currentAnswer: 'Use simpler language and examples',
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
    const expectedViewModel = {
      prisonerSummary,
      form: invalidForm,
      mode: 'review',
      currentAnswer: 'Use simpler language and examples',
    }

    // When
    await controller.getTeachingAdjustmentsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = {
      educationSupportPlanDto: aValidEducationSupportPlanDto(),
      reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto(),
    }
    req.body = {
      adjustmentsNeeded: YesNoValue.YES,
      details: 'Use simpler language and examples',
    }

    const expectedNextRoute = 'specific-teaching-skills'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      teachingAdjustmentsNeeded: true,
      teachingAdjustments: 'Use simpler language and examples',
    }

    // When
    await controller.submitTeachingAdjustmentsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: false,
        teachingAdjustments: undefined,
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        teachingAdjustmentsNeeded: false,
        teachingAdjustments: undefined,
      },
    }
    req.body = {
      adjustmentsNeeded: YesNoValue.YES,
      details: 'Use simpler language and examples',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      teachingAdjustmentsNeeded: true,
      teachingAdjustments: 'Use simpler language and examples',
    }

    // When
    await controller.submitTeachingAdjustmentsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
