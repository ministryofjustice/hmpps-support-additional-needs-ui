import { Request, Response } from 'express'
import EducationSupportPlanScheduleService from '../../../services/educationSupportPlanScheduleService'
import retrieveCurrentEducationSupportPlanCreationSchedule from './retrieveCurrentEducationSupportPlanCreationSchedule'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'

jest.mock('../../../services/educationSupportPlanScheduleService')

describe('retrieveCurrentEducationSupportPlanCreationSchedule', () => {
  const educationSupportPlanScheduleService = new EducationSupportPlanScheduleService(
    null,
  ) as jest.Mocked<EducationSupportPlanScheduleService>
  const requestHandler = retrieveCurrentEducationSupportPlanCreationSchedule(educationSupportPlanScheduleService)

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

  it('should retrieve current ELSP creation schedule and store on res.locals', async () => {
    // Given
    const expectedPlanCreationSchedule = aValidPlanCreationScheduleDto({ prisonNumber })
    educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule.mockResolvedValue(
      expectedPlanCreationSchedule,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanCreationSchedule.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlanCreationSchedule.value).toEqual(expectedPlanCreationSchedule)
    expect(educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule).toHaveBeenCalledWith(
      prisonNumber,
      username,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should null store on res.locals given service returns no current ELSP creation schedule for the prisoner', async () => {
    // Given
    educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule.mockResolvedValue(null)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanCreationSchedule.isFulfilled()).toEqual(true)
    expect(res.locals.educationSupportPlanCreationSchedule.value).toBeNull()
    expect(educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule).toHaveBeenCalledWith(
      prisonNumber,
      username,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store null on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.educationSupportPlanCreationSchedule.isFulfilled()).toEqual(false)
    expect(educationSupportPlanScheduleService.getCurrentEducationSupportPlanCreationSchedule).toHaveBeenCalledWith(
      prisonNumber,
      username,
    )
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
