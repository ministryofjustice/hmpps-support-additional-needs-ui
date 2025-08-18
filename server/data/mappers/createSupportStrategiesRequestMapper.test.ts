import { toCreateSupportStrategiesRequest } from './createSupportStrategiesRequestMapper'
import aValidSupportStrategyDto from '../../testsupport/supportStrategyDtoTestDataBuilder'
import {
  aValidCreateSupportStrategiesRequest,
  aValidSupportStrategyRequest,
} from '../../testsupport/supportStrategyRequestTestDataBuilder'
import SupportStrategyType from '../../enums/supportStrategyType'

describe('createSupportStrategiesRequestMapper', () => {
  describe('toCreateSupportStrategiesRequest', () => {
    it('should map an array of SupportStrategyDto to a CreateSupportStrategiesRequest', () => {
      // Given
      const supportStrategies = [
        aValidSupportStrategyDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          supportStrategyTypeCode: SupportStrategyType.MEMORY,
          supportStrategyDetails: 'Using flash cards with John can help him retain facts',
        }),
        aValidSupportStrategyDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          supportStrategyTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
          supportStrategyDetails: 'Allow John time to read and re-read the text',
        }),
        aValidSupportStrategyDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          supportStrategyTypeCode: SupportStrategyType.SENSORY,
          supportStrategyDetails: 'Ensure that no people are within close proximity to John',
        }),
      ]

      const expected = aValidCreateSupportStrategiesRequest({
        supportStrategies: [
          aValidSupportStrategyRequest({
            prisonId: 'BXI',
            supportStrategyTypeCode: 'MEMORY',
            detail: 'Using flash cards with John can help him retain facts',
          }),
          aValidSupportStrategyRequest({
            prisonId: 'BXI',
            supportStrategyTypeCode: 'LITERACY_SKILLS_DEFAULT',
            detail: 'Allow John time to read and re-read the text',
          }),
          aValidSupportStrategyRequest({
            prisonId: 'BXI',
            supportStrategyTypeCode: 'SENSORY',
            detail: 'Ensure that no people are within close proximity to John',
          }),
        ],
      })

      // When
      const actual = toCreateSupportStrategiesRequest(supportStrategies)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
