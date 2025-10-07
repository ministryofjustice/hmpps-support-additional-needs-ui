import { Request, Response } from 'express'
import WhoReviewedThePlanController from './whoReviewedThePlanController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import PlanReviewedByValue from '../../../../enums/planReviewedByValue'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('whoReviewedThePlanController', () => {
  const controller = new WhoReviewedThePlanController()

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
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        planReviewedByLoggedInUser: false,
        planReviewedByOtherFullName: 'A user',
        planReviewedByOtherJobRole: 'A job role',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/who-reviewed-the-plan/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        reviewedBy: PlanReviewedByValue.SOMEBODY_ELSE,
        reviewedByOtherFullName: 'A user',
        reviewedByOtherJobRole: 'A job role',
      },
      mode: 'review',
    }

    // When
    await controller.getWhoReviewedThePlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      reviewedBy: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/who-reviewed-the-plan/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'review' }

    // When
    await controller.getWhoReviewedThePlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto() }
    req.body = {
      reviewedBy: PlanReviewedByValue.SOMEBODY_ELSE,
      reviewedByOtherFullName: 'A user',
      reviewedByOtherJobRole: 'A job role',
    }

    const expectedNextRoute = 'other-people-consulted'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      planReviewedByLoggedInUser: false,
      planReviewedByOtherFullName: 'A user',
      planReviewedByOtherJobRole: 'A job role',
    }

    // When
    await controller.submitWhoReviewedThePlanForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
      },
    }
    req.body = {
      reviewedBy: PlanReviewedByValue.SOMEBODY_ELSE,
      reviewedByOtherFullName: 'A user',
      reviewedByOtherJobRole: 'A job role',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      planReviewedByLoggedInUser: false,
      planReviewedByOtherFullName: 'A user',
      planReviewedByOtherJobRole: 'A job role',
    }

    // When
    await controller.submitWhoReviewedThePlanForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
