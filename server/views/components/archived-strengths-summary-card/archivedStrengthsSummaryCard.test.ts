import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { StrengthResponseDto } from 'dto'
import { aValidStrengthResponseDto } from '../../../testsupport/strengthResponseDtoTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import { formatStrengthTypeScreenValueFilter } from '../../../filters/formatStrengthTypeFilter'
import StrengthType from '../../../enums/strengthType'
import StrengthCategory from '../../../enums/strengthCategory'
import StrengthIdentificationSource from '../../../enums/strengthIdentificationSource'
import formatStrengthIdentificationSourceScreenValueFilter from '../../../filters/formatStrengthIdentificationSourceFilter'

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

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  title: 'Literacy skills',
  archivedStrengths: [aValidStrengthResponseDto()],
  prisonNamesById,
}

const template = 'archivedStrengthsSummaryCard.test.njk'

describe('Tests for Archived Strengths Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given archived strengths', () => {
    // Given
    const params = {
      ...templateParams,
      archivedStrengths: [
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
          active: false,
          archiveReason: 'Strength added for the wrong prisoner by mistake',
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
          active: false,
          archiveReason: 'Strength added in error',
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    const archivedStrengths = $('.govuk-summary-list__row.archived-strength')
    expect(archivedStrengths.length).toEqual(2)

    const firstStrength = archivedStrengths.eq(0)
    expect(firstStrength.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstStrength.find('[data-qa=archived-strength-how-identified] li').length).toEqual(2)
    expect(firstStrength.find('[data-qa=archived-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstStrength.find('[data-qa=archived-strength-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstStrength.find('[data-qa=archived-strength-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(firstStrength.find('[data-qa=archived-strength-reason]').text().trim()).toEqual(
      'Strength added for the wrong prisoner by mistake',
    )

    const secondStrength = archivedStrengths.eq(1)
    expect(secondStrength.find('p').eq(0).text().trim()).toEqual('Can read at speed')
    expect(secondStrength.find('[data-qa=archived-strength-how-identified] li').length).toEqual(1)
    expect(secondStrength.find('[data-qa=archived-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Direct observation in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondStrength.find('[data-qa=archived-strength-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(secondStrength.find('[data-qa=archived-strength-reason]').text().trim()).toEqual('Strength added in error')
  })

  it('should not render the component given no strengths', () => {
    // Given
    const params = {
      ...templateParams,
      archivedStrengths: [] as Array<StrengthResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
