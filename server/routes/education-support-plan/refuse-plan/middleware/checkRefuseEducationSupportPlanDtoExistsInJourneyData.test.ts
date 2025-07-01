import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import checkRefuseEducationSupportPlanDtoExistsInJourneyData from './checkRefuseEducationSupportPlanDtoExistsInJourneyData'
import aValidRefuseEducationSupportPlanDto from '../../../../testsupport/refuseEducationSupportPlanDtoTestDataBuilder'

describe('checkRefuseEducationSupportPlanDtoInJourneyData', () => {
  const prisonNumber = 'A1234BC'
  const journeyId = uuidV4()

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
    req.originalUrl = `/education-support-plan/${prisonNumber}/refuse-plan/${journeyId}/reason`
  })

  it(`should invoke next handler given RefuseEducationSupportPlanDto exists in journeyData`, async () => {
    // Given
    req.journeyData.refuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto()

    // When
    await checkRefuseEducationSupportPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no RefuseEducationSupportPlanDto exists in journeyData`, async () => {
    // Given
    req.journeyData.refuseEducationSupportPlanDto = undefined

    // When
    await checkRefuseEducationSupportPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkRefuseEducationSupportPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
