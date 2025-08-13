import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO, startOfToday } from 'date-fns'
import type { StrengthResponseDto } from 'dto'
import { aValidStrengthResponseDto } from '../../../../../../testsupport/strengthResponseDtoTestDataBuilder'
import formatDateFilter from '../../../../../../filters/formatDateFilter'
import { formatStrengthTypeScreenValueFilter } from '../../../../../../filters/formatStrengthTypeFilter'
import StrengthType from '../../../../../../enums/strengthType'
import StrengthCategory from '../../../../../../enums/strengthCategory'
import StrengthIdentificationSource from '../../../../../../enums/strengthIdentificationSource'
import formatStrengthIdentificationSourceScreenValueFilter from '../../../../../../filters/formatStrengthIdentificationSourceFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatStrengthTypeScreenValue', formatStrengthTypeScreenValueFilter)
  .addFilter('formatStrengthIdentificationSourceScreenValue', formatStrengthIdentificationSourceScreenValueFilter)

const templateParams = {
  title: 'Literacy skills',
  strengthsData: {
    nonAlnStrengths: [aValidStrengthResponseDto()],
    latestAlnScreener: {
      createdAtPrison: 'BXI',
      screenerDate: startOfToday(),
      strengths: [aValidStrengthResponseDto()],
    },
  },
}

const template = 'strengthsSummaryCard.test.njk'

describe('Tests for Strengths Summary Card component', () => {
  it('should render the component given non-ALN and ALN strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [
          aValidStrengthResponseDto({
            strengthTypeCode: StrengthType.WRITING,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            symptoms: 'Hand-written text is well written and easy to read',
            howIdentified: [StrengthIdentificationSource.COLLEAGUE_INFO, StrengthIdentificationSource.OTHER],
            howIdentifiedOther: `I have seen and experienced John's written text before`,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:01:00'),
          }),
          aValidStrengthResponseDto({
            strengthTypeCode: StrengthType.READING,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            symptoms: 'Can read at speed',
            howIdentified: [StrengthIdentificationSource.EDUCATION_SKILLS_WORK],
            howIdentifiedOther: null,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:00:00'),
          }),
        ],
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          strengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.LANGUAGE_COMM_SKILLS_DEFAULT,
              strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(2)

    const firstStrength = nonAlnStrengths.eq(0)
    expect(firstStrength.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').length).toEqual(2)
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstStrength.find('[data-qa=non-aln-strength-audit]').text().trim()).toEqual(
      'Added on 10 February 2025 by Person 1',
    )

    const secondStrength = nonAlnStrengths.eq(1)
    expect(secondStrength.find('p').eq(0).text().trim()).toEqual('Can read at speed')
    expect(secondStrength.find('[data-qa=non-aln-strength-how-identified] li').length).toEqual(1)
    expect(secondStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Direct observation in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondStrength.find('[data-qa=non-aln-strength-audit]').text().trim()).toEqual(
      'Added on 10 February 2025 by Person 1',
    )

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(1)
    expect(alnStrengths.eq(0).text().trim()).toEqual('Language and communication skills') // LANGUAGE_COMM_SKILLS_DEFAULT
  })

  it('should render the component given only non-ALN strengths and no ALN Screener at all', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [
          aValidStrengthResponseDto({
            strengthTypeCode: StrengthType.WRITING,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            symptoms: 'Hand-written text is well written and easy to read',
            howIdentified: [StrengthIdentificationSource.COLLEAGUE_INFO, StrengthIdentificationSource.OTHER],
            howIdentifiedOther: `I have seen and experienced John's written text before`,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:01:00'),
          }),
        ],
        latestAlnScreener: {},
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)

    const firstStrength = nonAlnStrengths.eq(0)
    expect(firstStrength.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').length).toEqual(2)
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstStrength.find('[data-qa=non-aln-strength-audit]').text().trim()).toEqual(
      'Added on 10 February 2025 by Person 1',
    )

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(0)
  })

  it('should render the component given only ALN strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [] as Array<StrengthResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          strengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.LANGUAGE_COMM_SKILLS_DEFAULT,
              strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(0)

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(1)
    expect(alnStrengths.eq(0).text().trim()).toEqual('Language and communication skills') // LANGUAGE_COMM_SKILLS_DEFAULT
  })

  it('should not render the component given no strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [] as Array<StrengthResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: startOfToday(),
          strengths: [] as Array<StrengthResponseDto>,
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
