import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { PrisonerSearchSummary } from 'viewModels'
import formatDate from '../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../filters/formatPrisonerNameFilter'
import formatYesNoFilter from '../../../filters/formatYesNoFilter'
import PlanActionStatus from '../../../enums/planActionStatus'
import aValidPrisonerSearchSummary from '../../../testsupport/prisonerSearchSummaryTestDataBuilder'

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
  .addFilter('formatDate', formatDate)
  .addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))
  .addFilter('formatYesNo', formatYesNoFilter)

const template = '_searchResults.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  searchResults: {
    value: {
      prisoners: [aValidPrisonerSearchSummary()],
      page: 1,
      pagination: {},
    },
  },
  searchOptions: {
    searchTerm: '',
  },
  userHasPermissionTo,
}

describe('Tests for _searchResults', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render basic search results when there are results and user does not have permission to view plan status and dates', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-results-table]').length).toEqual(1)
    expect($('[data-qa=PLAN_STATUS-column-header]').length).toEqual(0)
    expect($('[data-qa=DEADLINE_DATE-column-header]').length).toEqual(0)
    expect($('[data-qa=zero-results-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH')
  })

  it('should render search results with plan status and dates when there are results and user has permission to view plan status and dates', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-results-table]').length).toEqual(1)
    expect($('[data-qa=PLAN_STATUS-column-header]').length).toEqual(1)
    expect($('[data-qa=DEADLINE_DATE-column-header]').length).toEqual(1)
    expect($('[data-qa=zero-results-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH')
  })

  it.each([
    { planStatus: PlanActionStatus.PLAN_OVERDUE, expectedTagSelector: 'plan-overdue-tag', expectedTag: 'Plan overdue' },
    { planStatus: PlanActionStatus.PLAN_DUE, expectedTagSelector: 'plan-due-tag', expectedTag: 'Plan due' },
    {
      planStatus: PlanActionStatus.REVIEW_OVERDUE,
      expectedTagSelector: 'review-overdue-tag',
      expectedTag: 'Review overdue',
    },
    { planStatus: PlanActionStatus.REVIEW_DUE, expectedTagSelector: 'review-due-tag', expectedTag: 'Review due' },
    { planStatus: PlanActionStatus.ACTIVE_PLAN, expectedTagSelector: 'active-plan-tag', expectedTag: 'Active plan' },
    { planStatus: PlanActionStatus.NEEDS_PLAN, expectedTagSelector: 'needs-plan-tag', expectedTag: 'Needs plan' },
    {
      planStatus: PlanActionStatus.INACTIVE_PLAN,
      expectedTagSelector: 'inactive-plan-tag',
      expectedTag: 'Inactive plan',
    },
    {
      planStatus: PlanActionStatus.PLAN_DECLINED,
      expectedTagSelector: 'plan-declined-tag',
      expectedTag: 'Plan declined',
    },
    { planStatus: PlanActionStatus.NO_PLAN, expectedTagSelector: 'no-plan-tag', expectedTag: 'No' },
  ])(
    'should render search results with plan status tag $expectedTag given search result with plan status $planStatus',
    spec => {
      // Given
      userHasPermissionTo.mockReturnValue(true)

      const params = {
        ...templateParams,
        searchResults: {
          value: {
            prisoners: [aValidPrisonerSearchSummary({ planStatus: spec.planStatus })],
            page: 1,
            pagination: {},
          },
        },
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=search-results-table]').length).toEqual(1)
      expect($('[data-qa=PLAN_STATUS-column-header]').length).toEqual(1)
      expect($(`[data-qa-plan-status=${spec.planStatus}]`).length).toEqual(1)
      expect($(`[data-qa-plan-status=${spec.planStatus}] span`).length).toEqual(1)
      expect($(`[data-qa=${spec.expectedTagSelector}]`).text().trim()).toEqual(spec.expectedTag)
      expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH')
    },
  )

  it.each([
    { planStatus: PlanActionStatus.PLAN_OVERDUE, expected: '5 Oct 2025' },
    { planStatus: PlanActionStatus.PLAN_DUE, expected: '5 Oct 2025' },
    {
      planStatus: PlanActionStatus.REVIEW_OVERDUE,
      expected: '5 Oct 2025',
    },
    { planStatus: PlanActionStatus.REVIEW_DUE, expected: '5 Oct 2025' },
    { planStatus: PlanActionStatus.ACTIVE_PLAN, expected: '5 Oct 2025' },
    { planStatus: PlanActionStatus.NEEDS_PLAN, expected: 'No due date' },
    {
      planStatus: PlanActionStatus.INACTIVE_PLAN,
      expected: 'N/A',
    },
    {
      planStatus: PlanActionStatus.PLAN_DECLINED,
      expected: 'N/A',
    },
    { planStatus: PlanActionStatus.NO_PLAN, expected: 'N/A' },
  ])('should render search results with due date $expected given search result with plan status $planStatus', spec => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      searchResults: {
        value: {
          prisoners: [
            aValidPrisonerSearchSummary({
              planStatus: spec.planStatus,
              deadlineDate: startOfDay('2025-10-05'),
            }),
          ],
          page: 1,
          pagination: {},
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-results-table]').length).toEqual(1)
    expect($('[data-qa-deadlineDate]').length).toEqual(1)
    expect($('[data-qa-deadlineDate]').text().trim()).toEqual(spec.expected)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH')
  })

  it('should not render search results when there are no results', () => {
    // Given
    const params = {
      ...templateParams,
      searchResults: {
        value: {
          prisoners: [] as Array<PrisonerSearchSummary>,
          page: 0,
          pagination: {},
        },
      },
      searchOptions: {
        searchTerm: 'John',
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-results-table]').length).toEqual(0)
    expect($('[data-qa=zero-results-message]').text().trim()).toEqual('0 results for "John"')
  })
})
