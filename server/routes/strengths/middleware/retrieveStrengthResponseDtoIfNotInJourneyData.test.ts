import { Request, Response } from 'express'
import createError from 'http-errors'
import StrengthService from '../../../services/strengthService'
import retrieveStrengthResponseDtoIfNotInJourneyData from './retrieveStrengthResponseDtoIfNotInJourneyData'
import { aValidStrengthResponseDto } from '../../../testsupport/strengthResponseDtoTestDataBuilder'

jest.mock('../../../services/strengthService')

describe('retrieveStrengthResponseDtoIfNotInJourneyData', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const requestHandler = retrieveStrengthResponseDtoIfNotInJourneyData(strengthService)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234GC'
  const otherPrisonNumber = 'Z1234ZZ'
  const strengthReference = '20148107-f96f-4696-b159-5aeba87a93f0'
  const otherStrengthReference = 'e8fffaa9-cf27-4b26-a917-49c1e9cd6087'

  const flash = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber, strengthReference },
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

  it('should retrieve strength given there is no strength in the journeyData', async () => {
    // Given
    req.journeyData.strengthDto = undefined

    const expectedStrengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    strengthService.getStrength.mockResolvedValue(expectedStrengthResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthResponseDto)
    expect(strengthService.getStrength).toHaveBeenCalledWith(username, prisonNumber, strengthReference)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve strength given there is already a strength in the journeyData but for a different prisoner', async () => {
    // Given
    req.journeyData.strengthDto = aValidStrengthResponseDto({ prisonNumber: otherPrisonNumber })

    const expectedStrengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    strengthService.getStrength.mockResolvedValue(expectedStrengthResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthResponseDto)
    expect(strengthService.getStrength).toHaveBeenCalledWith(username, prisonNumber, strengthReference)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve strength given there is already a strength in the journeyData but for a different reference', async () => {
    // Given
    req.journeyData.strengthDto = aValidStrengthResponseDto({ prisonNumber, reference: otherStrengthReference })

    const expectedStrengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    strengthService.getStrength.mockResolvedValue(expectedStrengthResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthResponseDto)
    expect(strengthService.getStrength).toHaveBeenCalledWith(username, prisonNumber, strengthReference)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve strength given there is already a strength in the journeyData with the requested reference', async () => {
    // Given
    req.journeyData.strengthDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })

    const expectedStrengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    strengthService.getStrength.mockResolvedValue(expectedStrengthResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.strengthDto).toEqual(expectedStrengthResponseDto)
    expect(strengthService.getStrength).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should call next with a 404 error given there is no strength for the prisoner and reference', async () => {
    // Given
    req.journeyData.strengthDto = undefined

    strengthService.getStrength.mockResolvedValue(null)

    const expectedError = createError(
      404,
      `Strength not found for prisoner ${prisonNumber} and reference ${strengthReference}`,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.strengthDto).toBeNull()
    expect(strengthService.getStrength).toHaveBeenCalledWith(username, prisonNumber, strengthReference)
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should redirect to strengths page with pageHasApiErrors set given an error retrieving the strength from the service', async () => {
    // Given
    req.journeyData.strengthDto = undefined

    const error = new Error('An error occurred')
    strengthService.getStrength.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.strengthDto).toBeUndefined()
    expect(strengthService.getStrength).toHaveBeenCalledWith(username, prisonNumber, strengthReference)
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/strengths`)
  })
})
