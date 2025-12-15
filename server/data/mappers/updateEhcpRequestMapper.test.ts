import anUpdateEhcpRequest from '../../testsupport/updateEhcpRequestTestDataBuilder'
import toUpdateEhcpRequest from './updateEhcpRequestMapper'
import aValidEducationSupportPlanDto from '../../testsupport/educationSupportPlanDtoTestDataBuilder'

describe('updateEhcpRequestMapper', () => {
  describe('toUpdateEhcpRequest', () => {
    it('should map an EhcpStatusDto to an UpdateEhcpRequest', () => {
      // Given
      const dto = aValidEducationSupportPlanDto({
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
