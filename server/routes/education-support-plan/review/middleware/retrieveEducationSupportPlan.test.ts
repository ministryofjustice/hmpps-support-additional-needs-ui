import { Request, Response } from 'express'
import createError from 'http-errors'
import EducationSupportPlanService from '../../../../services/educationSupportPlanService'
import retrieveEducationSupportPlan from './retrieveEducationSupportPlan'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'

jest.mock('../../../../services/educationSupportPlanService')

describe('retrieveEducationSupportPlan', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const requestHandler = retrieveEducationSupportPlan(educationSupportPlanService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  const req = {
    user: { username },
    params: { prisonNumber },
    journeyData: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should retrieve ELSP and store on journeyData given ELSP exists for prisoner and it does not already exist on the journeyData', async () => {
    // Given
    const expectedEducationSupportPlan = aValidEducationSupportPlanDto({ prisonNumber })
    educationSupportPlanService.getEducationSupportPlan.mockResolvedValue(expectedEducationSupportPlan)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlan)
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalledWith()
    expect(req.flash).not.toHaveBeenCalled()
  })

  it('should not retrieve ELSP given ELSP exists on the journeyData for the prisoner', async () => {
    // Given
    const expectedEducationSupportPlan = aValidEducationSupportPlanDto({ prisonNumber })
    req.journeyData.educationSupportPlanDto = expectedEducationSupportPlan

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlan)
    expect(educationSupportPlanService.getEducationSupportPlan).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith()
    expect(req.flash).not.toHaveBeenCalled()
  })

  it('should redirect to the profile overview page given ELSP already exists on the journeyData but for another prisoner', async () => {
    // Given
    const someoneElsesEducationSupportPlan = aValidEducationSupportPlanDto({ prisonNumber: 'Z1234XX' })
    req.journeyData.educationSupportPlanDto = someoneElsesEducationSupportPlan

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationSupportPlanDto).toEqual(someoneElsesEducationSupportPlan)
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(educationSupportPlanService.getEducationSupportPlan).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
  })

  it('should call next with 404 given service returns no ELSP for the prisoner', async () => {
    // Given
    educationSupportPlanService.getEducationSupportPlan.mockResolvedValue(null)

    const expectedError = createError(404, `No Education Learner Support Plan returned for prisoner ${prisonNumber}`)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
    expect(req.journeyData.educationSupportPlanDto).toBeUndefined()
    expect(req.flash).not.toHaveBeenCalled()
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
  })

  it('should redirect to the profile overview page given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    educationSupportPlanService.getEducationSupportPlan.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.educationSupportPlanDto).toBeUndefined()
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(req.flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).not.toHaveBeenCalled()
  })
})
