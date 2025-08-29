import { Request, Response } from 'express'
import EducationSupportPlanService from '../../../services/educationSupportPlanService'
import retrieveEducationSupportPlan from './retrieveEducationSupportPlan'
import aValidEducationSupportPlanDto from '../../../testsupport/educationSupportPlanDtoTestDataBuilder'

jest.mock('../../../services/educationSupportPlanService')

describe('retrieveEducationSupportPlan', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const requestHandler = retrieveEducationSupportPlan(educationSupportPlanService)

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

  it('should retrieve ELSP and store on res.locals', async () => {
    // Given
    const expectedEducationSupportPlan = aValidEducationSupportPlanDto({ prisonNumber })
    educationSupportPlanService.getEducationSupportPlan.mockResolvedValue(expectedEducationSupportPlan)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlan.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlan.value).toEqual(expectedEducationSupportPlan)
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should null store on res.locals given service returns no ELSP for the prisoner', async () => {
    // Given
    educationSupportPlanService.getEducationSupportPlan.mockResolvedValue(null)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlan.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlan.value).toBeNull()
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store null on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    educationSupportPlanService.getEducationSupportPlan.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlan.isFulfilled()).toEqual(false)
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
