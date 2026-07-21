import {
  consolidateIdentificationSources,
  containsDeprecatedIdentificationSource,
  DEPRECATED_IDENTIFICATION_SOURCES,
} from './identificationSourceConsolidation'

describe('identificationSourceConsolidation', () => {
  describe('consolidateIdentificationSources', () => {
    it.each([
      { source: 'CONVERSATIONS', expected: 'SELF_DISCLOSURE' },
      { source: 'COLLEAGUE_INFO', expected: 'FORMAL_PROCESSES' },
      { source: 'OTHER_SCREENING_TOOL', expected: 'FORMAL_PROCESSES' },
    ])('should map deprecated value $source to $expected', ({ source, expected }) => {
      expect(consolidateIdentificationSources([source])).toEqual([expected])
    })

    it.each(['EDUCATION_SKILLS_WORK', 'WIDER_PRISON', 'SELF_DISCLOSURE', 'FORMAL_PROCESSES', 'OTHER'])(
      'should leave retained value %s unchanged',
      value => {
        expect(consolidateIdentificationSources([value])).toEqual([value])
      },
    )

    it('should map a mix of deprecated and retained values, preserving order', () => {
      expect(
        consolidateIdentificationSources(['EDUCATION_SKILLS_WORK', 'CONVERSATIONS', 'COLLEAGUE_INFO', 'OTHER']),
      ).toEqual(['EDUCATION_SKILLS_WORK', 'SELF_DISCLOSURE', 'FORMAL_PROCESSES', 'OTHER'])
    })

    it('should de-duplicate values that consolidate to the same result', () => {
      expect(consolidateIdentificationSources(['COLLEAGUE_INFO', 'FORMAL_PROCESSES', 'OTHER_SCREENING_TOOL'])).toEqual([
        'FORMAL_PROCESSES',
      ])
    })

    it('should de-duplicate a deprecated value already present in its mapped form', () => {
      expect(consolidateIdentificationSources(['SELF_DISCLOSURE', 'CONVERSATIONS'])).toEqual(['SELF_DISCLOSURE'])
    })

    it.each([{ values: [] }, { values: undefined }])('should return an empty array for $values', ({ values }) => {
      expect(consolidateIdentificationSources(values)).toEqual([])
    })
  })

  describe('containsDeprecatedIdentificationSource', () => {
    it.each(DEPRECATED_IDENTIFICATION_SOURCES)('should return true when %s is present', value => {
      expect(containsDeprecatedIdentificationSource(['EDUCATION_SKILLS_WORK', value])).toBe(true)
    })

    it('should return false when only retained values are present', () => {
      expect(
        containsDeprecatedIdentificationSource([
          'EDUCATION_SKILLS_WORK',
          'SELF_DISCLOSURE',
          'FORMAL_PROCESSES',
          'OTHER',
        ]),
      ).toBe(false)
    })

    it.each([{ values: [] }, { values: undefined }])('should return false for $values', ({ values }) => {
      expect(containsDeprecatedIdentificationSource(values)).toBe(false)
    })
  })
})
