import { Request, Response } from 'express'
import PrisonService from '../../../services/prisonService'
import retrievePrisonsLookup from './retrievePrisonsLookup'

jest.mock('../../../services/prisonService')

describe('retrievePrisonsLookup', () => {
  const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
  const requestHandler = retrievePrisonsLookup(prisonService)

  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
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
    const prisonNamesById = {
      BXI: 'Brixton (HMP)',
      MDI: 'Moorland (HMP & YOI)',
    }
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonNamesById.isFulfilled()).toEqual(true)
    expect(res.locals.prisonNamesById.value).toEqual(prisonNamesById)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    prisonService.getAllPrisonNamesById.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonNamesById.isFulfilled()).toEqual(false)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
