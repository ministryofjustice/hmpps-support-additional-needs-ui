import { Request, Response } from 'express'
import checkConditionsListExistsInJourneyData from './checkConditionsListExistsInJourneyData'
import { aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'

describe('checkConditionsListExistsInJourneyData', () => {
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

  it(`should invoke next handler given ConditionsList exists in journeyData`, async () => {
    // Given
    req.journeyData.conditionsList = aValidConditionsList()

    // When
    await checkConditionsListExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no ConditionsList exists in journeyData`, async () => {
    // Given
    req.journeyData.conditionsList = undefined

    // When
    await checkConditionsListExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkConditionsListExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
