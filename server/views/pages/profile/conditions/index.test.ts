import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { aValidConditionDto, aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'
import formatConditionTypeScreenValueFilter from '../../../../filters/formatConditionTypeFilter'
import ConditionType from '../../../../enums/conditionType'
import ConditionSource from '../../../../enums/conditionSource'

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
  .addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))
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

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  tab: 'conditions',
  conditions: Result.fulfilled(aValidConditionsList()),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  pageHasApiErrors: false,
}

describe('Profile conditions page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile conditions page given prisoner has both diagnosed and self-declared conditions', () => {
    // Given
    const conditionList = aValidConditionsList({
      conditions: [
        aValidConditionDto({ conditionTypeCode: ConditionType.ADHD, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
        aValidConditionDto({ conditionTypeCode: ConditionType.DYSLEXIA, source: ConditionSource.SELF_DECLARED }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
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
    expect($('[data-qa=diagnosed-conditions-summary-card] .govuk-summary-list__row').text()).toContain(
      'Attention deficit hyperactivity disorder (ADHD or ADD)',
    )
    expect($('[data-qa=diagnosed-conditions-summary-card] .govuk-summary-list__row').text()).toContain(
      'Visual impairment',
    )

    expect($('[data-qa=self-declared-conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=self-declared-conditions-summary-card] .govuk-summary-list__row').length).toEqual(1) // Prisoner has 1 self-declared condition
    expect($('[data-qa=self-declared-conditions-summary-card] .govuk-summary-list__row').text()).toContain('Dyslexia')

    expect($('[data-qa=no-conditions-summary-card]').length).toEqual(0)
    expect($('[data-qa=no-conditions-summary-card] a').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile conditions page given prisoner has no active Conditions', () => {
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
    expect($('[data-qa=no-conditions-summary-card] a').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the profile conditions page given prisoner has no Conditions at all', () => {
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
    expect($('[data-qa=no-conditions-summary-card] a').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the profile conditions page given prisoner has no Conditions and the user does not have permission to create Conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
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
    expect($('[data-qa=no-conditions-summary-card] a').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the profile conditions page given the Conditions service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.rejected(new Error('Failed to get conditions')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-conditions-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
