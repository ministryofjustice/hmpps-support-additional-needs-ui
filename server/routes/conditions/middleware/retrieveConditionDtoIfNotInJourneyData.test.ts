import { Request, Response } from 'express'
import createError from 'http-errors'
import ConditionService from '../../../services/conditionService'
import retrieveConditionDtoIfNotInJourneyData from './retrieveConditionDtoIfNotInJourneyData'
import { aValidConditionDto } from '../../../testsupport/conditionDtoTestDataBuilder'

jest.mock('../../../services/conditionService')

describe('retrieveConditionResponseDtoIfNotInJourneyData', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const requestHandler = retrieveConditionDtoIfNotInJourneyData(conditionService)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234GC'
  const otherPrisonNumber = 'Z1234ZZ'
  const conditionReference = '20148107-f96f-4696-b159-5aeba87a93f0'
  const otherConditionReference = 'e8fffaa9-cf27-4b26-a917-49c1e9cd6087'

  const flash = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber, conditionReference },
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

  it('should retrieve condition given there is no condition in the journeyData', async () => {
    // Given
    req.journeyData.conditionDto = undefined

    const expectedConditionResponseDto = aValidConditionDto({ prisonNumber, reference: conditionReference })
    conditionService.getCondition.mockResolvedValue(expectedConditionResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.conditionDto).toEqual(expectedConditionResponseDto)
    expect(conditionService.getCondition).toHaveBeenCalledWith(username, prisonNumber, conditionReference)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve condition given there is already a condition in the journeyData but for a different prisoner', async () => {
    // Given
    req.journeyData.conditionDto = aValidConditionDto({ prisonNumber: otherPrisonNumber })

    const expectedConditionResponseDto = aValidConditionDto({ prisonNumber, reference: conditionReference })
    conditionService.getCondition.mockResolvedValue(expectedConditionResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.conditionDto).toEqual(expectedConditionResponseDto)
    expect(conditionService.getCondition).toHaveBeenCalledWith(username, prisonNumber, conditionReference)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve condition given there is already a condition in the journeyData but for a different reference', async () => {
    // Given
    req.journeyData.conditionDto = aValidConditionDto({ prisonNumber, reference: otherConditionReference })

    const expectedConditionResponseDto = aValidConditionDto({ prisonNumber, reference: conditionReference })
    conditionService.getCondition.mockResolvedValue(expectedConditionResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.conditionDto).toEqual(expectedConditionResponseDto)
    expect(conditionService.getCondition).toHaveBeenCalledWith(username, prisonNumber, conditionReference)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve condition given there is already a condition in the journeyData with the requested reference', async () => {
    // Given
    req.journeyData.conditionDto = aValidConditionDto({ prisonNumber, reference: conditionReference })

    const expectedConditionResponseDto = aValidConditionDto({ prisonNumber, reference: conditionReference })
    conditionService.getCondition.mockResolvedValue(expectedConditionResponseDto)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.conditionDto).toEqual(expectedConditionResponseDto)
    expect(conditionService.getCondition).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should call next with a 404 error given there is no condition for the prisoner and reference', async () => {
    // Given
    req.journeyData.conditionDto = undefined

    conditionService.getCondition.mockResolvedValue(null)

    const expectedError = createError(
      404,
      `Condition not found for prisoner ${prisonNumber} and reference ${conditionReference}`,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.conditionDto).toBeNull()
    expect(conditionService.getCondition).toHaveBeenCalledWith(username, prisonNumber, conditionReference)
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should redirect to conditions page with pageHasApiErrors set given an error retrieving the condition from the service', async () => {
    // Given
    req.journeyData.conditionDto = undefined

    const error = new Error('An error occurred')
    conditionService.getCondition.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData.conditionDto).toBeUndefined()
    expect(conditionService.getCondition).toHaveBeenCalledWith(username, prisonNumber, conditionReference)
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/conditions`)
  })
})
