import { Request, Response } from 'express'
import type { ReviewEducationSupportPlanDto } from 'dto'
import createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData from './createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData'

describe('createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData', () => {
  const prisonNumber = 'A1234BC'
  const prisonId = 'MDI'

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    locals: {
      user: { activeCaseLoadId: prisonId },
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should create an empty ReviewEducationSupportPlanDto for the prisoner given there is no ReviewEducationSupportPlanDto in the journeyData', async () => {
    // Given
    req.journeyData.reviewEducationSupportPlanDto = undefined

    const expectedReviewEducationSupportPlanDto = {
      prisonNumber,
      prisonId,
    } as ReviewEducationSupportPlanDto

    // When
    await createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should create an empty ReviewEducationSupportPlanDto for a prisoner given there is an ReviewEducationSupportPlanDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.reviewEducationSupportPlanDto = {
      prisonNumber: 'Z1234ZZ',
      prisonId,
    } as ReviewEducationSupportPlanDto

    const expectedReviewEducationSupportPlanDto = {
      prisonNumber,
      prisonId,
    } as ReviewEducationSupportPlanDto

    // When
    await createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should not create an empty ReviewEducationSupportPlanDto for the prisoner given there is already an ReviewEducationSupportPlanDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedReviewEducationSupportPlanDto = {
      prisonNumber,
      prisonId,
    } as ReviewEducationSupportPlanDto

    req.journeyData.reviewEducationSupportPlanDto = expectedReviewEducationSupportPlanDto

    // When
    await createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
