import { aValidConditionDto } from '../../testsupport/conditionDtoTestDataBuilder'
import mapPrisonNamesToReferencedAndAuditable from './mapPrisonNamesToReferencedAndAuditable'

describe('mapPrisonNamesToReferencedAndAuditable', () => {
  const prisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  it('should map prison names to a ReferencedAndAuditable instance given prison IDs are found in the lookup', () => {
    // Given
    const conditionDto = aValidConditionDto({ createdAtPrison: 'BXI', updatedAtPrison: 'MDI' })

    const expected = aValidConditionDto({ createdAtPrison: 'Brixton (HMP)', updatedAtPrison: 'Moorland (HMP & YOI)' })

    // When
    const actual = mapPrisonNamesToReferencedAndAuditable(conditionDto, prisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should not map prison names to a ReferencedAndAuditable instance given prison IDs are not found in the lookup', () => {
    // Given
    const conditionDto = aValidConditionDto({ createdAtPrison: 'LEI', updatedAtPrison: 'LEI' })

    const expected = aValidConditionDto({ createdAtPrison: 'LEI', updatedAtPrison: 'LEI' })

    // When
    const actual = mapPrisonNamesToReferencedAndAuditable(conditionDto, prisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
