import { Request, Response } from 'express'
import EducationSupportPlanService from '../../../services/educationSupportPlanService'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'
import retrieveEducationSupportPlanLifecycleStatus from './retrieveEducationSupportPlanLifecycleStatus'

jest.mock('../../../services/educationSupportPlanService')

describe('retrieveEducationSupportPlanLifecycleStatus', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const requestHandler = retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService)

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

  it('should retrieve ELSP lifecycle status and store on res.locals', async () => {
    // Given
    const expectedPlanCreationSchedule = aValidPlanCreationScheduleDto({ prisonNumber })
    educationSupportPlanService.getEducationSupportPlanLifecycleStatus.mockResolvedValue(expectedPlanCreationSchedule)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanlifecycleStatus.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlanlifecycleStatus.value).toEqual(expectedPlanCreationSchedule)
    expect(educationSupportPlanService.getEducationSupportPlanLifecycleStatus).toHaveBeenCalledWith(
      username,
      prisonNumber,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store null on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    educationSupportPlanService.getEducationSupportPlanLifecycleStatus.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanlifecycleStatus.isFulfilled()).toEqual(false)
    expect(educationSupportPlanService.getEducationSupportPlanLifecycleStatus).toHaveBeenCalledWith(
      username,
      prisonNumber,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
