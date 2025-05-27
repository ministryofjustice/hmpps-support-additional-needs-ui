import PrisonerService from './prisonerService'
import RedisPrisonerSearchStore from '../data/prisonerSearchStore/redisPrisonerSearchStore'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../data/prisonerSearchStore/redisPrisonerSearchStore')
jest.mock('../data/prisonerSearchClient')

describe('prisonerService', () => {
  const prisonerSearchStore = new RedisPrisonerSearchStore(null) as jest.Mocked<RedisPrisonerSearchStore>
  const prisonerSearchClient = new PrisonerSearchClient(null) as jest.Mocked<PrisonerSearchClient>
  const prisonerService = new PrisonerService(prisonerSearchStore, prisonerSearchClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPrisonerByPrisonNumber', () => {
    it('should get and cache prisoner by prison number given prisoner not in cache and prisoner search returns a prisoner', async () => {
      // Given
      prisonerSearchStore.getPrisoner.mockResolvedValue(null)

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber })

      // When
      const actual = await prisonerService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).toHaveBeenCalledWith(prisoner, 1)
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should get prisoner by prison number given prisoner is in cache', async () => {
      // Given
      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchStore.getPrisoner.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber })

      // When
      const actual = await prisonerService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).not.toHaveBeenCalled()
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).not.toHaveBeenCalled()
    })

    it('should not get prisoner by prison number given prisoner is not in the cache and prisoner search returns an error', async () => {
      // Given
      prisonerSearchStore.getPrisoner.mockResolvedValue(null)
      prisonerSearchClient.getPrisonerByPrisonNumber.mockRejectedValue(Error('Not Found'))

      // When
      const actual = await prisonerService.getPrisonerByPrisonNumber(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Not Found'))
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).not.toHaveBeenCalled()
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should get prisoner by prison number given prisoner not in cache and prisoner search returns a prisoner and cache returns an error', async () => {
      // Given
      prisonerSearchStore.getPrisoner.mockResolvedValue(null)
      prisonerSearchStore.setPrisoner.mockRejectedValue(Error('some error caching the prisoner'))

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber })

      // When
      const actual = await prisonerService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).toHaveBeenCalledWith(prisoner, 1)
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
