import { Request, Response } from 'express'
import checkStrengthDtoExistsInJourneyData from './checkStrengthDtoExistsInJourneyData'
import aValidStrengthDto from '../../../../testsupport/strengthDtoTestDataBuilder'

describe('checkStrengthDtoExistsInJourneyData', () => {
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

  it(`should invoke next handler given StrengthDto exists in journeyData`, async () => {
    // Given
    req.journeyData.strengthDto = aValidStrengthDto()

    // When
    await checkStrengthDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no StrengthDto exists in journeyData`, async () => {
    // Given
    req.journeyData.strengthDto = undefined

    // When
    await checkStrengthDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkStrengthDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
