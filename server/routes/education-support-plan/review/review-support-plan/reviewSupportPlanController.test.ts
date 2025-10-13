import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import ReviewSupportPlanController from './reviewSupportPlanController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('reviewDateController', () => {
  const controller = new ReviewSupportPlanController()

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
        reviewDate: parseISO('2025-06-10'),
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/review-support-plan/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        reviewDate: '10/6/2025',
      },
      mode: 'review',
    }

    // When
    await controller.getReviewSupportPlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      reviewDate: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/review-support-plan/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'review' }

    // When
    await controller.getReviewSupportPlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto() }
    req.body = {
      reviewDate: '10/6/2025',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      reviewDate: parseISO('2025-06-10'),
    }

    // When
    await controller.submitReviewSupportPlanForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      reviewEducationSupportPlanDto: { ...aValidReviewEducationSupportPlanDto(), reviewDate: parseISO('2025-06-09') },
    }
    req.body = {
      reviewDate: '10/6/2025',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      reviewDate: parseISO('2025-06-10'),
    }

    // When
    await controller.submitReviewSupportPlanForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
