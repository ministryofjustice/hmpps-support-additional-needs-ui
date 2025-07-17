import { Request, Response } from 'express'
import type { AlnScreenerDto } from 'dto'
import createEmptyAlnScreenerDtoIfNotInJourneyData from './createEmptyAlnScreenerDtoIfNotInJourneyData'

describe('createEmptyAlnScreenerDtoIfNotInJourneyData', () => {
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

  it('should create an empty AlnScreenerDto for the prisoner given there is no AlnScreenerDto in the journeyData', async () => {
    // Given
    req.journeyData.alnScreenerDto = undefined

    const expectedAlnScreenerDto = {
      prisonNumber,
      prisonId,
    } as AlnScreenerDto

    // When
    await createEmptyAlnScreenerDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })

  it('should create an empty AlnScreenerDto for a prisoner given there is an AlnScreenerDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.alnScreenerDto = { prisonNumber: 'Z1234ZZ', prisonId } as AlnScreenerDto

    const expectedAlnScreenerDto = {
      prisonNumber,
      prisonId,
    } as AlnScreenerDto

    // When
    await createEmptyAlnScreenerDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })

  it('should not create an empty AlnScreenerDto for the prisoner given there is already an AlnScreenerDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedAlnScreenerDto = {
      prisonNumber,
      prisonId,
    } as AlnScreenerDto

    req.journeyData.alnScreenerDto = expectedAlnScreenerDto

    // When
    await createEmptyAlnScreenerDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })
})
