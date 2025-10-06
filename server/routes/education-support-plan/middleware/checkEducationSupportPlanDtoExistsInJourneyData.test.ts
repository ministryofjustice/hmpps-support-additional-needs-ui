import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import checkEducationSupportPlanDtoExistsInJourneyData from './checkEducationSupportPlanDtoExistsInJourneyData'
import aValidEducationSupportPlanDto from '../../../testsupport/educationSupportPlanDtoTestDataBuilder'

describe('checkEducationSupportPlanDtoInJourneyData', () => {
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
    req.originalUrl = `/education-support-plan/${prisonNumber}/create/${journeyId}/check-your-answers`
  })

  it(`should invoke next handler given EducationSupportPlanDto exists in journeyData`, async () => {
    // Given
    req.journeyData.educationSupportPlanDto = aValidEducationSupportPlanDto()

    // When
    await checkEducationSupportPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no EducationSupportPlanDto exists in journeyData`, async () => {
    // Given
    req.journeyData.educationSupportPlanDto = undefined

    // When
    await checkEducationSupportPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Profile Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkEducationSupportPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
