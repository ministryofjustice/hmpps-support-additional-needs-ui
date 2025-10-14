import { Request, Response } from 'express'
import ExamArrangementsController from './examArrangementsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('examArrangementsController', () => {
  const controller = new ExamArrangementsController()

  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
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
        examArrangementsNeeded: true,
        examArrangements: 'Escort Chris to the exam hall 10 minutes before other students.',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        examArrangementsNeeded: undefined,
        examArrangements: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form and review DTO does not have an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        examArrangementsNeeded: true,
        examArrangements: 'Escort Chris to the exam hall 10 minutes before other students.',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        examArrangementsNeeded: undefined,
        examArrangements: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/exam-arrangements/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        arrangementsNeeded: YesNoValue.YES,
        details: 'Escort Chris to the exam hall 10 minutes before other students.',
      },
      mode: 'review',
      currentAnswer: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    // When
    await controller.getExamArrangementsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given no previously submitted invalid form and review DTO already has an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        examArrangementsNeeded: true,
        examArrangements: 'Escort Chris to the exam hall 10 minutes before other students.',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        examArrangementsNeeded: false,
        examArrangements: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/exam-arrangements/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        arrangementsNeeded: YesNoValue.NO,
        details: undefined as string,
      },
      mode: 'review',
      currentAnswer: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    // When
    await controller.getExamArrangementsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      arrangementsNeeded: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/exam-arrangements/index'
    const expectedViewModel = {
      prisonerSummary,
      form: invalidForm,
      mode: 'review',
      currentAnswer: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    // When
    await controller.getExamArrangementsView(req, res, next)

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
      arrangementsNeeded: YesNoValue.YES,
      details: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    const expectedNextRoute = 'lnsp-support'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      examArrangementsNeeded: true,
      examArrangements: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    // When
    await controller.submitExamArrangementsForm(req, res, next)

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
        examArrangementsNeeded: false,
        examArrangements: undefined,
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        examArrangementsNeeded: false,
        examArrangements: undefined,
      },
    }
    req.body = {
      arrangementsNeeded: YesNoValue.YES,
      details: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      examArrangementsNeeded: true,
      examArrangements: 'Escort Chris to the exam hall 10 minutes before other students.',
    }

    // When
    await controller.submitExamArrangementsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
