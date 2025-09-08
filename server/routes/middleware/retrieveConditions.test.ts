import { Request, Response } from 'express'
import ConditionService from '../../services/conditionService'
import retrieveConditions from './retrieveConditions'
import { aValidConditionsList } from '../../testsupport/conditionDtoTestDataBuilder'

jest.mock('../../services/conditionService')

describe('retrieveConditions', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const requestHandler = retrieveConditions(conditionService)

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

  it('should retrieve Conditions and store on res.locals', async () => {
    // Given
    const expectedConditionsList = aValidConditionsList({ prisonNumber })
    conditionService.getConditions.mockResolvedValue(expectedConditionsList)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.conditions.isFulfilled()).toEqual(true)
    expect(res.locals.conditions.value).toEqual(expectedConditionsList)
    expect(conditionService.getConditions).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    conditionService.getConditions.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.conditions.isFulfilled()).toEqual(false)
    expect(conditionService.getConditions).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
