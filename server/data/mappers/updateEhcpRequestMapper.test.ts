import anEhcpStatusDto from '../../testsupport/ehcpStatusDtoTestDataBuilder'
import anUpdateEhcpRequest from '../../testsupport/updateEhcpRequestTestDataBuilder'
import toUpdateEhcpRequest from './updateEhcpRequestMapper'

describe('updateEhcpRequestMapper', () => {
  describe('toUpdateEhcpRequest', () => {
    it('should map an EhcpStatusDto to an UpdateEhcpRequest', () => {
      // Given
      const dto = anEhcpStatusDto({
        hasCurrentEhcp: false,
        prisonId: 'MDI',
      })

      const expected = anUpdateEhcpRequest({
        hasCurrentEhcp: false,
        prisonId: 'MDI',
      })

      // When
      const actual = toUpdateEhcpRequest(dto)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
