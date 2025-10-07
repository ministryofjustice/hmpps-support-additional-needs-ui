import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import IndividualViewOnProgressController from './individualViewOnProgressController'

describe('individualViewOnProgressController', () => {
  const controller = new IndividualViewOnProgressController()

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
        prisonerDeclinedBeingPartOfReview: false,
        prisonerViewOnProgress: 'Chris is happy with his progress',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/individual-view-on-progress/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        prisonerDeclinedBeingPartOfReview: false,
        prisonerViewOnProgress: 'Chris is happy with his progress',
      },
      mode: 'review',
    }

    // When
    await controller.getIndividualViewOnProgressView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      prisonerDeclinedBeingPartOfReview: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/individual-view-on-progress/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'review' }

    // When
    await controller.getIndividualViewOnProgressView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto() }
    req.body = {
      prisonerDeclinedBeingPartOfReview: true,
      prisonerViewOnProgress: null,
    }

    const expectedNextRoute = 'your-view-on-progress'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      prisonerDeclinedBeingPartOfReview: true,
      prisonerViewOnProgress: undefined as string,
    }

    // When
    await controller.submitIndividualViewOnProgressForm(req, res, next)

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
        prisonerDeclinedBeingPartOfReview: true,
        prisonerViewOnProgress: null,
      },
    }
    req.body = {
      prisonerDeclinedBeingPartOfReview: false,
      prisonerViewOnProgress: 'Chris is happy with his progress',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      prisonerDeclinedBeingPartOfReview: false,
      prisonerViewOnProgress: 'Chris is happy with his progress',
    }

    // When
    await controller.submitIndividualViewOnProgressForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
