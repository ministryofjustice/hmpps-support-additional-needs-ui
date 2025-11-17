import aValidSupportStrategyDto from '../../testsupport/supportStrategyDtoTestDataBuilder'
import anArchiveSupportStrategyRequest from '../../testsupport/archiveSupportStrategyRequestTestDataBuilder'
import toArchiveSupportStrategyRequest from './archiveSupportStrategyRequestMapper'

describe('archiveSupportStrategyRequestMapper', () => {
  describe('toArchiveSupportStrategyRequest', () => {
    it('should map a SupportStrategyDto to an ArchiveSupportStrategyRequest', () => {
      // Given
      const supportStrategyDto = aValidSupportStrategyDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        archiveReason: 'The supportStrategy was created in error',
      })

      const expectedArchiveSupportStrategyRequest = anArchiveSupportStrategyRequest({
        prisonId: 'BXI',
        reason: 'The supportStrategy was created in error',
      })

      // When
      const actual = toArchiveSupportStrategyRequest(supportStrategyDto)

      // Then
      expect(actual).toEqual(expectedArchiveSupportStrategyRequest)
    })
  })
})
