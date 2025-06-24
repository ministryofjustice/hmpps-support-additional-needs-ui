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
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getAdditionalInformationView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
