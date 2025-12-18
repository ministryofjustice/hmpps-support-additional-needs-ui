import dedupeArrayFilter from './dedupeArrayFilter'

describe('dedupeArrayFilter', () => {
  it('should dedupe the specified array', () => {
    // Given
    const arrayOfThings = ['thing4', 'thing1', 'thing2', 'thing3', 'thing1', 'thing2', 'thing3']

    const expected = ['thing4', 'thing1', 'thing2', 'thing3']

    // When
    const actual = dedupeArrayFilter(arrayOfThings)

    // Then
    expect(actual).toEqual(expected)
  })
})
