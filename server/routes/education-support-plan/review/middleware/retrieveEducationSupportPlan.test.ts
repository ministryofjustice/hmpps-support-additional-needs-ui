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
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { user: undefined }
  })

  it('should retrieve ELSP and store on res.locals given ELSP exists for prisoner', async () => {
    // Given
    const expectedEducationSupportPlan = aValidEducationSupportPlanDto({ prisonNumber })
    educationSupportPlanService.getEducationSupportPlan.mockResolvedValue(expectedEducationSupportPlan)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlan.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlan.value).toEqual(expectedEducationSupportPlan)
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalledWith()
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
    expect(res.locals.educationSupportPlan).toBeUndefined()
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
    expect(res.locals.educationSupportPlan).toBeUndefined()
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(req.flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(educationSupportPlanService.getEducationSupportPlan).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).not.toHaveBeenCalled()
  })
})
