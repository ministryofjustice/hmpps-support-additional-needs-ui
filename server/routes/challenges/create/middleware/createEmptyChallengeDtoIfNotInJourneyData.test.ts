import { Request, Response } from 'express'
import type { StrengthDto } from 'dto'
import createEmptyStrengthDtoIfNotInJourneyData from './createEmptyStrengthDtoIfNotInJourneyData'

describe('createEmptyStrengthDtoIfNotInJourneyData', () => {
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

  it('should create an empty StrengthDto for the prisoner given there is no StrengthDto in the journeyData', async () => {
    // Given
    req.journeyData.strengthDto = undefined

    const expectedStrengthDto = {
      prisonNumber,
      prisonId,
    } as StrengthDto

    // When
    await createEmptyStrengthDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthDto)
  })

  it('should create an empty StrengthDto for a prisoner given there is an StrengthDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.strengthDto = { prisonNumber: 'Z1234ZZ', prisonId } as StrengthDto

    const expectedStrengthDto = {
      prisonNumber,
      prisonId,
    } as StrengthDto

    // When
    await createEmptyStrengthDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthDto)
  })

  it('should not create an empty StrengthDto for the prisoner given there is already an StrengthDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedStrengthDto = {
      prisonNumber,
      prisonId,
    } as StrengthDto

    req.journeyData.strengthDto = expectedStrengthDto

    // When
    await createEmptyStrengthDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthDto)
  })
})
