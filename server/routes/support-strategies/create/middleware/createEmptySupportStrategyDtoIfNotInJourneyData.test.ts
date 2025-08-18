import { Request, Response } from 'express'
import type { SupportStrategyDto } from 'dto'
import createEmptySupportStrategyDtoIfNotInJourneyData from './createEmptySupportStrategyDtoIfNotInJourneyData'

describe('createEmptySupportStrategyDtoIfNotInJourneyData', () => {
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

  it('should create an empty SupportStrategyDto for the prisoner given there is no SupportStrategyDto in the journeyData', async () => {
    // Given
    req.journeyData.supportStrategyDto = undefined

    const expectedSupportStrategyDto = {
      prisonNumber,
      prisonId,
    } as SupportStrategyDto

    // When
    await createEmptySupportStrategyDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyDto)
  })

  it('should create an empty SupportStrategyDto for a prisoner given there is an SupportStrategyDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.supportStrategyDto = { prisonNumber: 'Z1234ZZ', prisonId } as SupportStrategyDto

    const expectedSupportStrategyDto = {
      prisonNumber,
      prisonId,
    } as SupportStrategyDto

    // When
    await createEmptySupportStrategyDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyDto)
  })

  it('should not create an empty SupportStrategyDto for the prisoner given there is already an SupportStrategyDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedSupportStrategyDto = {
      prisonNumber,
      prisonId,
    } as SupportStrategyDto

    req.journeyData.supportStrategyDto = expectedSupportStrategyDto

    // When
    await createEmptySupportStrategyDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyDto)
  })
})
