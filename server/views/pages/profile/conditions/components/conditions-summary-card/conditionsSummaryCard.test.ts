import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { ConditionDto } from 'dto'
import { aValidConditionDto } from '../../../../../../testsupport/conditionDtoTestDataBuilder'
import formatDateFilter from '../../../../../../filters/formatDateFilter'
import formatConditionTypeScreenValueFilter from '../../../../../../filters/formatConditionTypeFilter'
import ConditionType from '../../../../../../enums/conditionType'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  title: 'Conditions',
  id: 'conditions',
  conditions: [aValidConditionDto()],
  prisonNamesById,
}

const template = 'conditionsSummaryCard.test.njk'

describe('Tests for Conditions Summary Card component', () => {
  it('should render the component', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionName: null,
          conditionDetails: 'ADHD details',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10'),
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.DYSLEXIA,
          conditionName: 'Phonological dyslexia',
          conditionDetails: 'Dyslexia details',
          updatedByDisplayName: 'Person 2',
          updatedAtPrison: 'BXI',
          updatedAt: parseISO('2025-06-03'),
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Conditions')
    expect($('.govuk-summary-list__row').length).toEqual(2)

    const firstCondition = $('.govuk-summary-list__row:nth-of-type(1)')
    expect(firstCondition.find('h3').text().trim()).toEqual('Attention deficit hyperactivity disorder (ADHD or ADD)')
    expect(firstCondition.find('[data-qa=condition-name]').length).toEqual(0)
    expect(firstCondition.find('[data-qa=condition-details]').text().trim()).toEqual('ADHD details')
    expect(firstCondition.find('[data-qa=condition-audit]').text().trim()).toEqual(
      'Added on 10 February 2025 by Person 1, Leeds (HMP)',
    )

    const secondCondition = $('.govuk-summary-list__row:nth-of-type(2)')
    expect(secondCondition.find('h3').text().trim()).toEqual('Dyslexia')
    expect(secondCondition.find('[data-qa=condition-name]').text().trim()).toEqual('Phonological dyslexia')
    expect(secondCondition.find('[data-qa=condition-details]').text().trim()).toEqual('Dyslexia details')
    expect(secondCondition.find('[data-qa=condition-audit]').text().trim()).toEqual(
      'Added on 3 June 2025 by Person 2, Brixton (HMP)',
    )
  })

  it('should render the component given prison name lookup does not resolve prisons', () => {
    // Given
    const params = {
      ...templateParams,
      prisonNamesById: {},
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionName: null,
          conditionDetails: 'ADHD details',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10'),
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.DYSLEXIA,
          conditionName: 'Phonological dyslexia',
          conditionDetails: 'Dyslexia details',
          updatedByDisplayName: 'Person 2',
          updatedAtPrison: 'BXI',
          updatedAt: parseISO('2025-06-03'),
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Conditions')
    expect($('.govuk-summary-list__row').length).toEqual(2)

    const firstCondition = $('.govuk-summary-list__row:nth-of-type(1)')
    expect(firstCondition.find('h3').text().trim()).toEqual('Attention deficit hyperactivity disorder (ADHD or ADD)')
    expect(firstCondition.find('[data-qa=condition-name]').length).toEqual(0)
    expect(firstCondition.find('[data-qa=condition-details]').text().trim()).toEqual('ADHD details')
    expect(firstCondition.find('[data-qa=condition-audit]').text().trim()).toEqual(
      'Added on 10 February 2025 by Person 1, LEI',
    )

    const secondCondition = $('.govuk-summary-list__row:nth-of-type(2)')
    expect(secondCondition.find('h3').text().trim()).toEqual('Dyslexia')
    expect(secondCondition.find('[data-qa=condition-name]').text().trim()).toEqual('Phonological dyslexia')
    expect(secondCondition.find('[data-qa=condition-details]').text().trim()).toEqual('Dyslexia details')
    expect(secondCondition.find('[data-qa=condition-audit]').text().trim()).toEqual(
      'Added on 3 June 2025 by Person 2, BXI',
    )
  })

  it('should not render the component given no conditions', () => {
    // Given
    const params = { ...templateParams, conditions: [] as Array<ConditionDto> }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
