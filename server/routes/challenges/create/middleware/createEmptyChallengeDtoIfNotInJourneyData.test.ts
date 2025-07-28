import { Request, Response } from 'express'
import type { ChallengeDto } from 'dto'
import createEmptyChallengeDtoIfNotInJourneyData from './createEmptyChallengeDtoIfNotInJourneyData'

describe('createEmptyChallengeDtoIfNotInJourneyData', () => {
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

  it('should create an empty ChallengeDto for the prisoner given there is no ChallengeDto in the journeyData', async () => {
    // Given
    req.journeyData.challengeDto = undefined

    const expectedChallengeDto = {
      prisonNumber,
      prisonId,
    } as ChallengeDto

    // When
    await createEmptyChallengeDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeDto)
  })

  it('should create an empty ChallengeDto for a prisoner given there is an ChallengeDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.challengeDto = { prisonNumber: 'Z1234ZZ', prisonId } as ChallengeDto

    const expectedChallengeDto = {
      prisonNumber,
      prisonId,
    } as ChallengeDto

    // When
    await createEmptyChallengeDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeDto)
  })

  it('should not create an empty ChallengeDto for the prisoner given there is already an ChallengeDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedChallengeDto = {
      prisonNumber,
      prisonId,
    } as ChallengeDto

    req.journeyData.challengeDto = expectedChallengeDto

    // When
    await createEmptyChallengeDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeDto)
  })
})
