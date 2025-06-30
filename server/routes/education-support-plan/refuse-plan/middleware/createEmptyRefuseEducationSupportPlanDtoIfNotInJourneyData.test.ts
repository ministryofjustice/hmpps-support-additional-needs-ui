import { Request, Response } from 'express'
import type { RefuseEducationSupportPlanDto } from 'dto'
import createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData from './createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData'

describe('createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should create an empty RefuseEducationSupportPlanDto for the prisoner given there is no RefuseEducationSupportPlanDto in the journeyData', async () => {
    // Given
    req.journeyData.refuseEducationSupportPlanDto = undefined

    const expectedRefuseEducationSupportPlanDto = {
      prisonNumber,
    } as RefuseEducationSupportPlanDto

    // When
    await createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.refuseEducationSupportPlanDto).toEqual(expectedRefuseEducationSupportPlanDto)
  })

  it('should create an empty RefuseEducationSupportPlanDto for a prisoner given there is an RefuseEducationSupportPlanDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.refuseEducationSupportPlanDto = { prisonNumber: 'Z1234ZZ' } as RefuseEducationSupportPlanDto

    const expectedRefuseEducationSupportPlanDto = {
      prisonNumber,
    } as RefuseEducationSupportPlanDto

    // When
    await createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.refuseEducationSupportPlanDto).toEqual(expectedRefuseEducationSupportPlanDto)
  })

  it('should not create an empty RefuseEducationSupportPlanDto for the prisoner given there is already an RefuseEducationSupportPlanDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedRefuseEducationSupportPlanDto = {
      prisonNumber,
    } as RefuseEducationSupportPlanDto

    req.journeyData.refuseEducationSupportPlanDto = expectedRefuseEducationSupportPlanDto

    // When
    await createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.refuseEducationSupportPlanDto).toEqual(expectedRefuseEducationSupportPlanDto)
  })
})
