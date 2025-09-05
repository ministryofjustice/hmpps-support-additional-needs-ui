import { Request, Response } from 'express'
import StrengthService from '../../services/strengthService'
import retrieveStrengths from './retrieveStrengths'
import { aValidStrengthsList } from '../../testsupport/strengthResponseDtoTestDataBuilder'

jest.mock('../../services/strengthService')

describe('retrieveStrengths', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const requestHandler = retrieveStrengths(strengthService)

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

  it('should retrieve Strengths and store on res.locals', async () => {
    // Given
    const expectedStrengthsList = aValidStrengthsList({ prisonNumber })
    strengthService.getStrengths.mockResolvedValue(expectedStrengthsList)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.strengths.isFulfilled()).toEqual(true)
    expect(res.locals.strengths.value).toEqual(expectedStrengthsList)
    expect(strengthService.getStrengths).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    strengthService.getStrengths.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.strengths.isFulfilled()).toEqual(false)
    expect(strengthService.getStrengths).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
