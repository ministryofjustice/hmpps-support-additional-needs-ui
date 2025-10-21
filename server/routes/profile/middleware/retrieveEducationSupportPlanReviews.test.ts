import { Request, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'
import retrieveEducationSupportPlanReviews from './retrieveEducationSupportPlanReviews'
import EducationSupportPlanReviewService from '../../../services/educationSupportPlanReviewService'
import aValidReviewEducationSupportPlanDto from '../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

jest.mock('../../../services/educationSupportPlanReviewService')

describe('retrieveEducationSupportPlanReviews', () => {
  const educationSupportPlanReviewsService = new EducationSupportPlanReviewService(
    null,
  ) as jest.Mocked<EducationSupportPlanReviewService>
  const requestHandler = retrieveEducationSupportPlanReviews(educationSupportPlanReviewsService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { user: undefined, apiErrorCallback }
  })

  it('should retrieve ELSP Reviews and store on res.locals', async () => {
    // Given
    const expectedEducationSupportPlanReviews = [aValidReviewEducationSupportPlanDto({ prisonNumber })]
    educationSupportPlanReviewsService.getEducationSupportPlanReviews.mockResolvedValue(
      expectedEducationSupportPlanReviews,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanReviews.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlanReviews.value).toEqual(expectedEducationSupportPlanReviews)
    expect(educationSupportPlanReviewsService.getEducationSupportPlanReviews).toHaveBeenCalledWith(
      username,
      prisonNumber,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store empty array on res.locals given service returns empty array of ELSP Reviews for the prisoner', async () => {
    // Given
    const expectedEducationSupportPlanReviews: Array<ReviewEducationSupportPlanDto> = []
    educationSupportPlanReviewsService.getEducationSupportPlanReviews.mockResolvedValue(
      expectedEducationSupportPlanReviews,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanReviews.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlanReviews.value).toEqual(expectedEducationSupportPlanReviews)
    expect(educationSupportPlanReviewsService.getEducationSupportPlanReviews).toHaveBeenCalledWith(
      username,
      prisonNumber,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store null on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    educationSupportPlanReviewsService.getEducationSupportPlanReviews.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanReviews.isFulfilled()).toEqual(false)
    expect(educationSupportPlanReviewsService.getEducationSupportPlanReviews).toHaveBeenCalledWith(
      username,
      prisonNumber,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
