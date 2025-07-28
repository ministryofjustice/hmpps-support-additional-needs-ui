import { Request, Response } from 'express'
import type { ConditionsList } from 'dto'
import createEmptyConditionsListIfNotInJourneyData from './createEmptyConditionsListIfNotInJourneyData'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'

describe('createEmptyConditionsListIfNotInJourneyData', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should create an empty ConditionsList for the prisoner given there is no ConditionsList in the journeyData', async () => {
    // Given
    req.journeyData.conditionsList = undefined

    const expectedConditionsList = {
      prisonNumber,
      conditions: [],
    } as ConditionsList

    // When
    await createEmptyConditionsListIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.conditionsList).toEqual(expectedConditionsList)
  })

  it('should create an empty ConditionsList for a prisoner given there is an ConditionsList in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.conditionsList = { prisonNumber: 'Z1234ZZ' } as ConditionsList

    const expectedConditionsList = {
      prisonNumber,
      conditions: [],
    } as ConditionsList

    // When
    await createEmptyConditionsListIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.conditionsList).toEqual(expectedConditionsList)
  })

  it('should not create an empty ConditionsList for the prisoner given there is already an ConditionsList in the journeyData for the prisoner', async () => {
    // Given
    const expectedConditionsList = {
      prisonNumber,
      conditions: [aValidConditionDto()],
    } as ConditionsList

    req.journeyData.conditionsList = expectedConditionsList

    // When
    await createEmptyConditionsListIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.conditionsList).toEqual(expectedConditionsList)
  })
})
