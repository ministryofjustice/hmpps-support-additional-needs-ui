import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfToday, subDays } from 'date-fns'
import formatDate from '../../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import { aValidConditionDto, aValidConditionsList } from '../../../../../testsupport/conditionDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import formatConditionTypeScreenValueFilter from '../../../../../filters/formatConditionTypeFilter'
import ConditionType from '../../../../../enums/conditionType'
import ConditionSource from '../../../../../enums/conditionSource'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('assetMap', () => '')
  .addFilter('formatDate', formatDate)
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary({
  firstName: 'IFEREECA',
  lastName: 'PEIGH',
})
const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const template = 'index.njk'

const templateParams = {
  prisonerSummary,
  conditions: Result.fulfilled(aValidConditionsList()),
  prisonNamesById: Result.fulfilled(prisonNamesById),
}

describe('Create ELSP - review existing conditions page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Review Conditions page given prisoner has both diagnosed and self-declared conditions', () => {
    // Given
    const conditionList = aValidConditionsList({
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
          updatedAt: startOfToday(),
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.DYSLEXIA,
          source: ConditionSource.SELF_DECLARED,
          updatedAt: subDays(startOfToday(), 5),
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.TOURETTES,
          source: ConditionSource.SELF_DECLARED,
          updatedAt: subDays(startOfToday(), 3),
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
          updatedAt: subDays(startOfToday(), 1),
        }),
      ],
    })
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(conditionList),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=diagnosed-conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=diagnosed-conditions-summary-card] .govuk-summary-list__row').length).toEqual(2) // Prisoner has 2 diagnosed conditions
    expect($('[data-qa=diagnosed-conditions-summary-card] .govuk-summary-list__row').eq(0).text()).toContain(
      'Attention deficit hyperactivity disorder (ADHD or ADD)',
    ) // expect ADHD to be the first row as it is the most recent based on it's updatedAt property
    expect($('[data-qa=diagnosed-conditions-summary-card] .govuk-summary-list__row').eq(1).text()).toContain(
      'Visual impairment',
    ) // expect Visual Impairment to be the 2nd row as it is older than ADHD based on it's updatedAt property.

    expect($('[data-qa=self-declared-conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=self-declared-conditions-summary-card] .govuk-summary-list__row').length).toEqual(2) // Prisoner has 2 self-declared conditions
    expect($('[data-qa=self-declared-conditions-summary-card] .govuk-summary-list__row').eq(0).text()).toContain(
      `Tourette's syndrome or tic disorder`,
    ) // expect Tourettes to be the first row as it is the most recent based on it's updatedAt property
    expect($('[data-qa=self-declared-conditions-summary-card] .govuk-summary-list__row').eq(1).text()).toContain(
      'Dyslexia',
    ) // expect Dyslexia to be the 2nd row as it is older than Tourettes based on it's updatedAt property.

    expect($('[data-qa=no-conditions-summary-card]').length).toEqual(0)
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Conditions page given prisoner has no active Conditions', () => {
    // Given
    const conditionList = aValidConditionsList({
      conditions: [
        aValidConditionDto({ conditionName: 'Condition 1', active: false }),
        aValidConditionDto({ conditionName: 'Condition 2', active: false }),
        aValidConditionDto({ conditionName: 'Condition 3', active: false }),
      ],
    })
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(conditionList),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Conditions page given prisoner has no Conditions at all', () => {
    // Given
    const conditionList = aValidConditionsList({ conditions: [] })
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(conditionList),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Conditions page given the Conditions service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.rejected(new Error('Failed to get conditions')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=no-conditions-summary-card]').length).toEqual(0)
  })
})
