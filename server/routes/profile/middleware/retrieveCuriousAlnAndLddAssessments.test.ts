import { Request, Response } from 'express'
import CuriousService from '../../../services/curiousService'
import retrieveCuriousAlnAndLddAssessments from './retrieveCuriousAlnAndLddAssessments'
import { aCuriousAlnAndLddAssessmentsDto } from '../../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'

jest.mock('../../../services/curiousService')

describe('retrieveCuriousAlnAndLddAssessments', () => {
  const curiousService = new CuriousService(null) as jest.Mocked<CuriousService>
  const requestHandler = retrieveCuriousAlnAndLddAssessments(curiousService)

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

  it('should retrieve ALN and LDD Assessments and store on res.locals', async () => {
    // Given
    const expectedAssessments = aCuriousAlnAndLddAssessmentsDto()
    curiousService.getAlnAndLddAssessments.mockResolvedValue(expectedAssessments)

    // When
    await requestHandler(req, res, next)

    // Then
    const curiousAlnAndLddAssessments = await res.locals.curiousAlnAndLddAssessments
    expect(curiousAlnAndLddAssessments.isFulfilled()).toEqual(true)
    expect(curiousAlnAndLddAssessments.value).toEqual(expectedAssessments)
    expect(curiousService.getAlnAndLddAssessments).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    curiousService.getAlnAndLddAssessments.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    const curiousAlnAndLddAssessments = await res.locals.curiousAlnAndLddAssessments
    expect(curiousAlnAndLddAssessments.isFulfilled()).toEqual(false)
    expect(curiousService.getAlnAndLddAssessments).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
