import { Request, Response } from 'express'
import ChallengeService from '../../services/challengeService'
import retrieveChallenges from './retrieveChallenges'
import { aValidChallengeResponse } from '../../testsupport/challengeResponseTestDataBuilder'

jest.mock('../../services/challengeService')

describe('retrieveChallenges', () => {
  const mockedChallengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>

  const requestHandler = retrieveChallenges(mockedChallengeService)
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

  it('should retrieve challenges and store in res.locals', async () => {
    // Given
    const expectedChallenge = [aValidChallengeResponse()]
    mockedChallengeService.getChallenges.mockResolvedValue(expectedChallenge)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.challenges.isFulfilled()).toEqual(true)
    expect(res.locals.challenges.value).toEqual(expectedChallenge)
    expect(mockedChallengeService.getChallenges).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    mockedChallengeService.getChallenges.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.challenges.isFulfilled()).toEqual(false)
    expect(mockedChallengeService.getChallenges).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
