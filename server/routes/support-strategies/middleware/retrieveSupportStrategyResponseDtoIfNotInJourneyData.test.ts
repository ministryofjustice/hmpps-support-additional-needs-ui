import { Request, Response } from 'express'
import createError from 'http-errors'
import SupportStrategyService from '../../../services/supportStrategyService'
import retrieveSupportStrategyResponseDtoIfNotInJourneyData from './retrieveSupportStrategyResponseDtoIfNotInJourneyData'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'

jest.mock('../../../services/supportStrategyService')

describe('retrieveSupportStrategyResponseDtoIfNotInJourneyData', () => {
  const supportStrategyService = new SupportStrategyService(null) as jest.Mocked<SupportStrategyService>
  const requestHandler = retrieveSupportStrategyResponseDtoIfNotInJourneyData(supportStrategyService)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234GC'
  const otherPrisonNumber = 'Z1234ZZ'
  const supportStrategyReference = '20148107-f96f-4696-b159-5aeba87a93f0'
  const otherSupportStrategyReference = 'e8fffaa9-cf27-4b26-a917-49c1e9cd6087'

  const flash = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber, supportStrategyReference },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should retrieve support strategy given there is no support strategy in the journeyData', async () => {
    // Given
    req.journeyData.supportStrategyDto = undefined

    const expectedSupportStrategyResponseDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })
    supportStrategyService.getSupportStrategy.mockResolvedValue(expectedSupportStrategyResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyResponseDto)
    expect(supportStrategyService.getSupportStrategy).toHaveBeenCalledWith(
      username,
      prisonNumber,
      supportStrategyReference,
    )
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve support strategy given there is already a support strategy in the journeyData but for a different prisoner', async () => {
    // Given
    req.journeyData.supportStrategyDto = aValidSupportStrategyResponseDto({ prisonNumber: otherPrisonNumber })

    const expectedSupportStrategyResponseDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })
    supportStrategyService.getSupportStrategy.mockResolvedValue(expectedSupportStrategyResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyResponseDto)
    expect(supportStrategyService.getSupportStrategy).toHaveBeenCalledWith(
      username,
      prisonNumber,
      supportStrategyReference,
    )
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve support strategy given there is already a support strategy in the journeyData but for a different reference', async () => {
    // Given
    req.journeyData.supportStrategyDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: otherSupportStrategyReference,
    })

    const expectedSupportStrategyResponseDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })
    supportStrategyService.getSupportStrategy.mockResolvedValue(expectedSupportStrategyResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyResponseDto)
    expect(supportStrategyService.getSupportStrategy).toHaveBeenCalledWith(
      username,
      prisonNumber,
      supportStrategyReference,
    )
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve support strategy given there is already a support strategy in the journeyData with the requested reference', async () => {
    // Given
    req.journeyData.supportStrategyDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })

    const expectedSupportStrategyResponseDto = aValidSupportStrategyResponseDto({
      prisonNumber,
      reference: supportStrategyReference,
    })
    supportStrategyService.getSupportStrategy.mockResolvedValue(expectedSupportStrategyResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.supportStrategyDto).toEqual(expectedSupportStrategyResponseDto)
    expect(supportStrategyService.getSupportStrategy).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should call next with a 404 error given there is no support strategy for the prisoner and reference', async () => {
    // Given
    req.journeyData.supportStrategyDto = undefined

    supportStrategyService.getSupportStrategy.mockResolvedValue(null)

    const expectedError = createError(
      404,
      `Support Strategy not found for prisoner ${prisonNumber} and reference ${supportStrategyReference}`,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.supportStrategyDto).toBeNull()
    expect(supportStrategyService.getSupportStrategy).toHaveBeenCalledWith(
      username,
      prisonNumber,
      supportStrategyReference,
    )
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should redirect to support strategies page with pageHasApiErrors set given an error retrieving the support strategy from the service', async () => {
    // Given
    req.journeyData.supportStrategyDto = undefined

    const error = new Error('An error occurred')
    supportStrategyService.getSupportStrategy.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.supportStrategyDto).toBeUndefined()
    expect(supportStrategyService.getSupportStrategy).toHaveBeenCalledWith(
      username,
      prisonNumber,
      supportStrategyReference,
    )
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/support-strategies`)
  })
})
