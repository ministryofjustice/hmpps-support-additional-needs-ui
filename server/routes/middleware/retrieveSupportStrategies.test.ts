import { Request, Response } from 'express'
import SupportStrategyService from '../../services/supportStrategyService'
import retrieveSupportStrategies from './retrieveSupportStrategies'
import aValidSupportStrategyResponseDto from '../../testsupport/supportStrategyResponseDtoTestDataBuilder'

jest.mock('../../services/supportStrategyService')

describe('retrieveSupportStrategies', () => {
  const mockedSupportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>

  const requestHandler = retrieveSupportStrategies(mockedSupportStrategyService)
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

  it('should retrieve current support strategies and store in res.locals', async () => {
    // Given
    const expectedSupportStrategies = [aValidSupportStrategyResponseDto()]
    mockedSupportStrategyService.getSupportStrategies.mockResolvedValue(expectedSupportStrategies)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.supportStrategies.isFulfilled()).toEqual(true)
    expect(res.locals.supportStrategies.value).toEqual(expectedSupportStrategies)
    expect(mockedSupportStrategyService.getSupportStrategies).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    mockedSupportStrategyService.getSupportStrategies.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.supportStrategies.isFulfilled()).toEqual(false)
    expect(mockedSupportStrategyService.getSupportStrategies).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
