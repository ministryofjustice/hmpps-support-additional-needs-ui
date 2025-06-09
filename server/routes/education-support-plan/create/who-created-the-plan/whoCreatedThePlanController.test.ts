import { Request, Response } from 'express'
import WhoCreatedThePlanController from './whoCreatedThePlanController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import PlanCreatedByValue from '../../../../enums/planCreatedByValue'

describe('whoCreatedThePlanController', () => {
  const controller = new WhoCreatedThePlanController()

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
        planCreatedByLoggedInUser: false,
        planCreatedByOtherFullName: 'A user',
        planCreatedByOtherJobRole: 'A job role',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/who-created-the-plan/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        completedBy: PlanCreatedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'A user',
        completedByOtherJobRole: 'A job role',
      },
    }

    // When
    await controller.getWhoCreatedThePlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      completedBy: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/who-created-the-plan/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getWhoCreatedThePlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      completedBy: PlanCreatedByValue.SOMEBODY_ELSE,
      completedByOtherFullName: 'A user',
      completedByOtherJobRole: 'A job role',
    }

    const expectedNextRoute = 'other-people-consulted'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      planCreatedByLoggedInUser: false,
      planCreatedByOtherFullName: 'A user',
      planCreatedByOtherJobRole: 'A job role',
    }

    // When
    await controller.submitWhoCreatedThePlanForm(req, res, next)

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
        planCreatedByLoggedInUser: true,
        planCreatedByOtherFullName: undefined,
        planCreatedByOtherJobRole: undefined,
      },
    }
    req.body = {
      completedBy: PlanCreatedByValue.SOMEBODY_ELSE,
      completedByOtherFullName: 'A user',
      completedByOtherJobRole: 'A job role',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      planCreatedByLoggedInUser: false,
      planCreatedByOtherFullName: 'A user',
      planCreatedByOtherJobRole: 'A job role',
    }

    // When
    await controller.submitWhoCreatedThePlanForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
