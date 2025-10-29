import { Request, Response } from 'express'
import createError from 'http-errors'
import ChallengeService from '../../../services/challengeService'
import retrieveChallengeResponseDtoIfNotInJourneyData from './retrieveChallengeResponseDtoIfNotInJourneyData'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'

jest.mock('../../../services/challengeService')

describe('retrieveChallengeResponseDtoIfNotInJourneyData', () => {
  const challengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const requestHandler = retrieveChallengeResponseDtoIfNotInJourneyData(challengeService)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234GC'
  const otherPrisonNumber = 'Z1234ZZ'
  const challengeReference = '20148107-f96f-4696-b159-5aeba87a93f0'
  const otherChallengeReference = 'e8fffaa9-cf27-4b26-a917-49c1e9cd6087'

  const flash = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber, challengeReference },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should retrieve challenge given there is no challenge in the journeyData', async () => {
    // Given
    req.journeyData.challengeDto = undefined

    const expectedChallengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    challengeService.getChallenge.mockResolvedValue(expectedChallengeResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeResponseDto)
    expect(challengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve challenge given there is already a challenge in the journeyData but for a different prisoner', async () => {
    // Given
    req.journeyData.challengeDto = aValidChallengeResponseDto({ prisonNumber: otherPrisonNumber })

    const expectedChallengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    challengeService.getChallenge.mockResolvedValue(expectedChallengeResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeResponseDto)
    expect(challengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve challenge given there is already a challenge in the journeyData but for a different reference', async () => {
    // Given
    req.journeyData.challengeDto = aValidChallengeResponseDto({ prisonNumber, reference: otherChallengeReference })

    const expectedChallengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    challengeService.getChallenge.mockResolvedValue(expectedChallengeResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeResponseDto)
    expect(challengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve challenge given there is already a challenge in the journeyData with the requested reference', async () => {
    // Given
    req.journeyData.challengeDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })

    const expectedChallengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    challengeService.getChallenge.mockResolvedValue(expectedChallengeResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.challengeDto).toEqual(expectedChallengeResponseDto)
    expect(challengeService.getChallenge).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should call next with a 404 error given there is no challenge for the prisoner and reference', async () => {
    // Given
    req.journeyData.challengeDto = undefined

    challengeService.getChallenge.mockResolvedValue(null)

    const expectedError = createError(
      404,
      `Challenge not found for prisoner ${prisonNumber} and reference ${challengeReference}`,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.challengeDto).toBeNull()
    expect(challengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should redirect to challenges page with pageHasApiErrors set given an error retrieving the challenge from the service', async () => {
    // Given
    req.journeyData.challengeDto = undefined

    const error = new Error('An error occurred')
    challengeService.getChallenge.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.challengeDto).toBeUndefined()
    expect(challengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/challenges`)
  })
})
