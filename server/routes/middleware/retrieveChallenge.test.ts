import { Request, Response } from 'express'
import ChallengeService from '../../services/challengeService'
import retrieveChallenge from './retrieveChallenge'
import aValidChallengeResponseDto from '../../testsupport/challengeResponseDtoTestDataBuilder'

jest.mock('../../services/challengeService')

describe('retrieveChallenge', () => {
  const mockedChallengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>

  const requestHandler = retrieveChallenge(mockedChallengeService)
  const prisonNumber = 'A1234BC'
  const challengeReference = '02b21586-02a3-4938-a4c6-95d76f098f7d'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber, challengeReference },
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

  it('should retrieve challenge and store in res.locals', async () => {
    // Given
    const expectedChallenge = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    mockedChallengeService.getChallenge.mockResolvedValue(expectedChallenge)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.challenge.isFulfilled()).toEqual(true)
    expect(res.locals.challenge.value).toEqual(expectedChallenge)
    expect(mockedChallengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    mockedChallengeService.getChallenge.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.challenge.isFulfilled()).toEqual(false)
    expect(mockedChallengeService.getChallenge).toHaveBeenCalledWith(username, prisonNumber, challengeReference)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
