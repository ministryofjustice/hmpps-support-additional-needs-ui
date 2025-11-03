import aValidSupportStrategyDto from '../../testsupport/supportStrategyDtoTestDataBuilder'
import SupportStrategyType from '../../enums/supportStrategyType'
import anUpdateSupportStrategyRequest from '../../testsupport/updateSupportStrategyRequestTestDataBuilder'
import toUpdateSupportStrategyRequest from './updateSupportStrategyRequestMapper'

describe('updateSupportStrategyRequestMapper', () => {
  describe('toUpdateSupportStrategyRequest', () => {
    it('should map a SupportStrategyDto to an UpdateSupportStrategyRequest', () => {
      // Given
      const supportStrategyDto = aValidSupportStrategyDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        supportStrategyTypeCode: SupportStrategyType.MEMORY,
        supportStrategyDetails: 'Using flash cards with John can help him retain facts',
      })

      const expectedUpdateSupportStrategyRequest = anUpdateSupportStrategyRequest({
        prisonId: 'BXI',
        detail: 'Using flash cards with John can help him retain facts',
      })

      // When
      const actual = toUpdateSupportStrategyRequest(supportStrategyDto)

      // Then
      expect(actual).toEqual(expectedUpdateSupportStrategyRequest)
    })
  })
})
