import { Request, Response } from 'express'
import checkSupportStrategyDtoExistsInJourneyData from './checkSupportStrategyDtoExistsInJourneyData'
import aValidSupportStrategyDto from '../../../../testsupport/supportStrategyDtoTestDataBuilder'

describe('checkSupportStrategyDtoExistsInJourneyData', () => {
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

  it(`should invoke next handler given SupportStrategyDto exists in journeyData`, async () => {
    // Given
    req.journeyData.supportStrategyDto = aValidSupportStrategyDto()

    // When
    await checkSupportStrategyDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no SupportStrategyDto exists in journeyData`, async () => {
    // Given
    req.journeyData.supportStrategyDto = undefined

    // When
    await checkSupportStrategyDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkSupportStrategyDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
