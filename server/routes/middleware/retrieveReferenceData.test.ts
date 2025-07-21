import { Request, Response } from 'express'
import retrieveReferenceData from './retrieveReferenceData'
import ReferenceDataDomain from '../../enums/referenceDataDomain'
import ReferenceDataService from '../../services/referenceDataService'

jest.mock('../../services/referenceDataService')

describe('retrieveReferenceData', () => {
  const referenceDataService = new ReferenceDataService(null, null) as jest.Mocked<ReferenceDataService>

  const username = 'AUSER_GEN'

  const req = {
    user: { username },
  } as unknown as Request
  const res = {
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.challengesReferenceData = undefined
    res.locals.strengthsReferenceData = undefined
    res.locals.conditionsReferenceData = undefined
  })

  it('should retrieve the challenge reference data', async () => {
    // Given
    const middleware = retrieveReferenceData(ReferenceDataDomain.CHALLENGE, referenceDataService)

    const expectedReferenceData = {
      LITERACY_SKILLS: [
        { code: 'COGNITION_LEARNING', areaCode: 'READING' },
        { code: 'COGNITION_LEARNING', areaCode: 'SPELLING' },
      ],
    }
    referenceDataService.getChallenges.mockResolvedValue(expectedReferenceData)

    // When
    await middleware(req, res, next)

    // Then
    expect(res.locals.challengesReferenceData).toEqual(expectedReferenceData)
    expect(res.locals.strengthsReferenceData).toBeUndefined()
    expect(res.locals.conditionsReferenceData).toBeUndefined()
    expect(referenceDataService.getChallenges).toHaveBeenCalledWith(username, false)
  })

  it('should retrieve the strengths reference data', async () => {
    // Given
    const middleware = retrieveReferenceData(ReferenceDataDomain.STRENGTH, referenceDataService)

    const expectedReferenceData = {
      LITERACY_SKILLS: [
        { code: 'COGNITION_LEARNING', areaCode: 'READING' },
        { code: 'COGNITION_LEARNING', areaCode: 'SPELLING' },
      ],
    }
    referenceDataService.getStrengths.mockResolvedValue(expectedReferenceData)

    // When
    await middleware(req, res, next)

    // Then
    expect(res.locals.challengesReferenceData).toBeUndefined()
    expect(res.locals.strengthsReferenceData).toEqual(expectedReferenceData)
    expect(res.locals.conditionsReferenceData).toBeUndefined()
    expect(referenceDataService.getStrengths).toHaveBeenCalledWith(username, false)
  })

  it('should retrieve the conditions reference data', async () => {
    // Given
    const middleware = retrieveReferenceData(ReferenceDataDomain.CONDITION, referenceDataService)

    const expectedReferenceData = {
      LEARNING_DIFFICULTY: [{ code: 'ADHC' }],
    }
    referenceDataService.getConditions.mockResolvedValue(expectedReferenceData)

    // When
    await middleware(req, res, next)

    // Then
    expect(res.locals.challengesReferenceData).toBeUndefined()
    expect(res.locals.strengthsReferenceData).toBeUndefined()
    expect(res.locals.conditionsReferenceData).toEqual(expectedReferenceData)
    expect(referenceDataService.getConditions).toHaveBeenCalledWith(username, false)
  })
})
