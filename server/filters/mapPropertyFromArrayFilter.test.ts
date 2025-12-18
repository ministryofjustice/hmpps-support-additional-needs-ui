import mapPropertyFromArrayFilter from './mapPropertyFromArrayFilter'

describe('mapPropertyFromArrayFilter', () => {
  it('should map an array returning the specified property', () => {
    // Given
    const arrayOfThings = [
      { name: 'thing1', value: 'value1', active: true },
      { name: 'thing2', value: 'value2', active: false },
      { name: 'thing3', value: 'value3', active: true },
    ]

    const expected = ['thing1', 'thing2', 'thing3']

    // When
    const actual = mapPropertyFromArrayFilter(arrayOfThings, 'name')

    // Then
    expect(actual).toEqual(expected)
  })
})
