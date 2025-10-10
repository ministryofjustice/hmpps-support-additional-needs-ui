import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import ReviewersViewOnProgressController from './reviewersViewOnProgressController'

describe('reviewersViewOnProgressController', () => {
  const controller = new ReviewersViewOnProgressController()

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
        reviewersViewOnProgress: 'Chris has made average progress',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/reviewers-view-on-progress/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        reviewersViewOnProgress: 'Chris has made average progress',
      },
      mode: 'review',
      planReviewedByLoggedInUser: true,
    }

    // When
    await controller.getReviewersViewOnProgressView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      reviewersViewOnProgress: undefined as string,
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/reviewers-view-on-progress/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'review', planReviewedByLoggedInUser: true }

    // When
    await controller.getReviewersViewOnProgressView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto() }
    req.body = {
      reviewersViewOnProgress: 'Chris has made average progress',
    }

    const expectedNextRoute = 'review-existing-needs'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      reviewersViewOnProgress: 'Chris has made average progress',
    }

    // When
    await controller.submitReviewersViewOnProgressForm(req, res, next)

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
        reviewersViewOnProgress: 'Chris has made average progress',
      },
    }
    req.body = {
      reviewersViewOnProgress: 'Chris has made incredible progress',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      reviewersViewOnProgress: 'Chris has made incredible progress',
    }

    // When
    await controller.submitReviewersViewOnProgressForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
