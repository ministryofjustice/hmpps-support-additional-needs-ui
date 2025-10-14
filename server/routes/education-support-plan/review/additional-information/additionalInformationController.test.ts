import { Request, Response } from 'express'
import AdditionalInformationController from './additionalInformationController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('additionalInformationController', () => {
  const controller = new AdditionalInformationController()

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
        additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        additionalInformation: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form and review DTO does not have an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        additionalInformation: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/additional-information/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
      mode: 'review',
      currentAnswer: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.getAdditionalInformationView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given no previously submitted invalid form and review DTO already has an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        additionalInformation: 'Chris is not so positive now that he has started education',
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/additional-information/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        additionalInformation: 'Chris is not so positive now that he has started education',
      },
      mode: 'review',
      currentAnswer: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.getAdditionalInformationView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      additionalInformation: 'value too long! '.repeat(15),
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/additional-information/index'
    const expectedViewModel = {
      prisonerSummary,
      form: invalidForm,
      mode: 'review',
      currentAnswer: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.getAdditionalInformationView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = {
      educationSupportPlanDto: aValidEducationSupportPlanDto({ additionalInformation: null }),
      reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto({ additionalInformation: null }),
    }
    req.body = {
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    const expectedNextRoute = 'next-review-date'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.submitAdditionalInformationForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      educationSupportPlanDto: aValidEducationSupportPlanDto({ additionalInformation: null }),
      reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto({ additionalInformation: null }),
    }
    req.body = {
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.submitAdditionalInformationForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
