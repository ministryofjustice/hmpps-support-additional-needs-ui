import { Request, Response } from 'express'
import AdditionalInformationController from './additionalInformationController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'

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
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

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
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto({ additionalInformation: null }) }
    req.body = {
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    const expectedNextRoute = 'next-review-date'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.submitAdditionalInformationForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto({ additionalInformation: null }) }
    req.body = {
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
    }

    // When
    await controller.submitAdditionalInformationForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
