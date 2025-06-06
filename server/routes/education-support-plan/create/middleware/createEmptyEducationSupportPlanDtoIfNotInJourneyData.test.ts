import { Request, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import createEmptyEducationSupportPlanDtoIfNotInJourneyData from './createEmptyEducationSupportPlanDtoIfNotInJourneyData'

describe('createEmptyEducationSupportPlanDtoIfNotInJourneyData', () => {
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

  it('should create an empty EducationSupportPlanDto for the prisoner given there is no EducationSupportPlanDto in the journeyData', async () => {
    // Given
    req.journeyData.educationSupportPlanDto = undefined

    const expectedEducationSupportPlanDto = {
      prisonNumber,
      prisonId,
    } as EducationSupportPlanDto

    // When
    await createEmptyEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should create an empty EducationSupportPlanDto for a prisoner given there is an EducationSupportPlanDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.educationSupportPlanDto = { prisonNumber: 'Z1234ZZ', prisonId } as EducationSupportPlanDto

    const expectedEducationSupportPlanDto = {
      prisonNumber,
      prisonId,
    } as EducationSupportPlanDto

    // When
    await createEmptyEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should not create an empty EducationSupportPlanDto for the prisoner given there is already an EducationSupportPlanDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedEducationSupportPlanDto = {
      prisonNumber,
      prisonId,
    } as EducationSupportPlanDto

    req.journeyData.educationSupportPlanDto = expectedEducationSupportPlanDto

    // When
    await createEmptyEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
