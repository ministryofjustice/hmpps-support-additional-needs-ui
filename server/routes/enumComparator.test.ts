import enumComparator from './enumComparator'
import ConditionType from '../enums/conditionType'

describe('enumComparator', () => {
  it(`should determine if a ENUM string is alphabetically before another ENUM string`, () => {
    // Given
    const enum1 = ConditionType.LONG_TERM_OTHER
    const enum2 = ConditionType.TOURETTES

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a ENUM string is alphabetically before another ENUM string using character later in the string`, () => {
    // Given
    const enum1 = ConditionType.ABI
    const enum2 = ConditionType.ASC

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a ENUM string is alphabetically after another ENUM string`, () => {
    // Given
    const enum1 = ConditionType.TOURETTES
    const enum2 = ConditionType.LONG_TERM_OTHER

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given a ENUM string which is 'OTHER' and another ENUM string is alphabetically before 'OTHER'`, () => {
    // Given
    const enum1 = ConditionType.OTHER
    const enum2 = ConditionType.DYSLEXIA

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given a ENUM string which 'OTHER' and another ENUM string is alphabetically after 'OTHER'`, () => {
    // Given
    const enum1 = ConditionType.OTHER
    const enum2 = ConditionType.VISUAL_IMPAIR

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return -1 given an ENUM string is alphabetically before 'OTHER' and ENUM string iss 'OTHER'`, () => {
    // Given
    const enum1 = ConditionType.DYSLEXIA
    const enum2 = ConditionType.OTHER

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should return -1 given an ENUM string is alphabetically after 'OTHER' and ENUM string is 'OTHER'`, () => {
    // Given
    const enum1 = ConditionType.VISUAL_IMPAIR
    const enum2 = ConditionType.OTHER

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it('should sort an array ENUM strings alphabetically, but with OTHER at the end', () => {
    // Given
    const enum1 = ConditionType.VISUAL_IMPAIR
    const enum2 = ConditionType.OTHER
    const enum3 = ConditionType.ABI
    const enum4 = ConditionType.LONG_TERM_OTHER

    const enums = [enum1, enum2, enum3, enum4]

    const expected = [enum3, enum4, enum1, enum2] // alphabetically on ENUM string, with OTHER at the end

    // When
    enums.sort(enumComparator)

    // Then
    expect(enums).toEqual(expected)
  })
})
