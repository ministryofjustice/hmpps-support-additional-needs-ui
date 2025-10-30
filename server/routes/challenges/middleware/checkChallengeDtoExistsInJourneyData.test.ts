import { Request, Response } from 'express'
import checkChallengeDtoExistsInJourneyData from './checkChallengeDtoExistsInJourneyData'
import aValidChallengeDto from '../../../testsupport/challengeDtoTestDataBuilder'

describe('checkChallengeDtoExistsInJourneyData', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = { prisonNumber }
  })

  it(`should invoke next handler given ChallengeDto exists in journeyData`, async () => {
    // Given
    req.journeyData.challengeDto = aValidChallengeDto()

    // When
    await checkChallengeDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no ChallengeDto exists in journeyData`, async () => {
    // Given
    req.journeyData.challengeDto = undefined

    // When
    await checkChallengeDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkChallengeDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
