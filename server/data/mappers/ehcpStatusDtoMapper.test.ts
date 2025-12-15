import type { EhcpStatusResponse } from 'supportAdditionalNeedsApiClient'
import toEhcpStatusDto from './ehcpStatusDtoMapper'
import anEhcpStatusResponse from '../../testsupport/ehcpStatusResponseTestDataBuilder'
import anEhcpStatusDto from '../../testsupport/ehcpStatusDtoTestDataBuilder'

describe('ehcpStatusDtoMapper', () => {
  describe('toEhcpStatusDto', () => {
    it('should map a EhcpStatusResponse to a EhcpStatusDto', () => {
      // Given
      const ehcpStatusResponse = anEhcpStatusResponse({
        hasCurrentEhcp: true,
      })

      const expected = anEhcpStatusDto({
        hasCurrentEhcp: true,
        prisonId: null,
      })

      // When
      const actual = toEhcpStatusDto(ehcpStatusResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should not map a null EhcpStatusResponse to a EhcpStatusDto', () => {
      // Given
      const ehcpStatusResponse: EhcpStatusResponse = null

      // When
      const actual = toEhcpStatusDto(ehcpStatusResponse)

      // Then
      expect(actual).toBeNull()
    })
  })
})
