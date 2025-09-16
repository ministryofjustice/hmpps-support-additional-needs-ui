import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { addMonths, format, startOfToday } from 'date-fns'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import PlanActionStatus from '../../../../../enums/planActionStatus'
import formatDateFilter from '../../../../../filters/formatDateFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)

const planCreationDeadlineDate = startOfToday()
const planReviewDeadlineDate = addMonths(planCreationDeadlineDate, 3)

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
  planStatus: PlanActionStatus.PLAN_DUE,
  planCreationDeadlineDate,
  planReviewDeadlineDate: null as Date,
}

const template = 'actionCards.test.njk'

describe('Tests for Profile pages actions card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the actions card component given the user has permissions for all actions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(7) // expect all 5 links to be present
    // Assert each one in turn
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect($('[data-qa=add-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect($('[data-qa=add-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect($('[data-qa=add-conditions-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span.govuk-tag').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect($('[data-qa=create-education-support-plan-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect($('[data-qa=decline-education-support-plan-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user has permissions for no actions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(0) // expect 0 links to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user only has permission to record ALN screeners', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user only has permission to view deadlines and statuses', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(0) // expect no links to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user only has permission to record challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect($('[data-qa=add-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user only has permission to record strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user only has permission to record support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect($('[data-qa=add-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it('should render the actions card component given the user only has permission to record conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect($('[data-qa=add-conditions-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
    expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_ELSP_DEADLINES_AND_STATUSES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_EDUCATION_LEARNER_SUPPORT_PLAN')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN')
  })

  it.each([
    { planStatus: PlanActionStatus.NEEDS_PLAN, expectedElementSelector: 'needs-plan-tag' },
    { planStatus: PlanActionStatus.PLAN_DUE, expectedElementSelector: 'plan-due-tag' },
    { planStatus: PlanActionStatus.ACTIVE_PLAN, expectedElementSelector: 'active-plan-tag' },
    { planStatus: PlanActionStatus.PLAN_OVERDUE, expectedElementSelector: 'plan-overdue-tag' },
    { planStatus: PlanActionStatus.INACTIVE_PLAN, expectedElementSelector: 'inactive-plan-tag' },
    { planStatus: PlanActionStatus.PLAN_DECLINED, expectedElementSelector: 'plan-declined-tag' },
  ])(
    'should render the actions card component with the correct tag given the user has permission to view deadlines and statuses and a plan status of $planStatus',
    ({ planStatus, expectedElementSelector }) => {
      // Given
      userHasPermissionTo.mockReturnValue(true)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=education-support-plan-actions] span.govuk-tag').length).toEqual(1)
      expect($(`[data-qa=education-support-plan-actions] span[data-qa=${expectedElementSelector}]`).length).toEqual(1)
    },
  )

  it.each([
    //
    PlanActionStatus.REVIEW_DUE,
    PlanActionStatus.REVIEW_OVERDUE,
    PlanActionStatus.NO_PLAN,
  ])(
    'should render the actions card component without a tag given the user has permission to view deadlines and statuses and a plan status of unsupported type %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(true)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=education-support-plan-actions] span').length).toEqual(0)
    },
  )

  it.each([
    //
    PlanActionStatus.PLAN_OVERDUE,
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.NEEDS_PLAN,
    PlanActionStatus.PLAN_DECLINED,
  ])(
    'should render the actions card component with a link to create an ELSP given the user has permission to create ELSPs and a plan status of %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(true)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=create-education-support-plan-button]').length).toEqual(1)
    },
  )

  it.each([
    //
    PlanActionStatus.PLAN_OVERDUE,
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.NEEDS_PLAN,
    PlanActionStatus.PLAN_DECLINED,
  ])(
    'should render the actions card component without a link to create an ELSP given the user does not have permission to create ELSPs and a plan status of %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(false)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=create-education-support-plan-button]').length).toEqual(0)
    },
  )

  it.each([
    //
    PlanActionStatus.REVIEW_DUE,
    PlanActionStatus.REVIEW_OVERDUE,
    PlanActionStatus.ACTIVE_PLAN,
    PlanActionStatus.INACTIVE_PLAN,
    PlanActionStatus.NO_PLAN,
  ])(
    'should render the actions card component without link to create an ELSP given the user has permission to create ELSPs and a plan status of unsupported type %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(true)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=create-education-support-plan-button]').length).toEqual(0)
    },
  )

  it.each([
    //
    PlanActionStatus.PLAN_OVERDUE,
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.NEEDS_PLAN,
  ])(
    'should render the actions card component with a link to decline an ELSP given the user has permission to decline ELSPs and a plan status of %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(true)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=decline-education-support-plan-button]').length).toEqual(1)
    },
  )

  it.each([
    //
    PlanActionStatus.PLAN_OVERDUE,
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.NEEDS_PLAN,
  ])(
    'should render the actions card component without a link to decline an ELSP given the user does not have permission to decline ELSPs and a plan status of %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(false)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=decline-education-support-plan-button]').length).toEqual(0)
    },
  )

  it.each([
    //
    PlanActionStatus.REVIEW_DUE,
    PlanActionStatus.REVIEW_OVERDUE,
    PlanActionStatus.ACTIVE_PLAN,
    PlanActionStatus.INACTIVE_PLAN,
    PlanActionStatus.PLAN_DECLINED,
    PlanActionStatus.NO_PLAN,
  ])(
    'should render the actions card component without link to decline an ELSP given the user has permission to decline ELSPs and a plan status of unsupported type %s',
    planStatus => {
      // Given
      userHasPermissionTo.mockReturnValue(true)
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=decline-education-support-plan-button]').length).toEqual(0)
    },
  )

  it.each([
    //
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.PLAN_OVERDUE,
  ])(
    'should render the actions card component with the plan creation due date given a plan status of %s',
    planStatus => {
      // Given
      const params = {
        ...templateParams,
        planCreationDeadlineDate,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=plan-creation-due-date]').text().trim()).toEqual(
        `Create plan by ${format(planCreationDeadlineDate, 'd MMM yyyy')}`,
      )
    },
  )

  it.each([
    //
    PlanActionStatus.REVIEW_OVERDUE,
    PlanActionStatus.REVIEW_DUE,
    PlanActionStatus.ACTIVE_PLAN,
    PlanActionStatus.NEEDS_PLAN,
    PlanActionStatus.INACTIVE_PLAN,
    PlanActionStatus.PLAN_DECLINED,
    PlanActionStatus.NO_PLAN,
  ])(
    'should render the actions card component without the plan creation due date given a plan status of %s',
    planStatus => {
      // Given
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=plan-creation-due-date]').length).toEqual(0)
    },
  )

  it.each([
    //
    PlanActionStatus.ACTIVE_PLAN,
  ])('should render the actions card component with the plan review due date given a plan status of %s', planStatus => {
    // Given
    const params = {
      ...templateParams,
      planReviewDeadlineDate,
      planStatus,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=plan-review-due-date]').text().trim()).toEqual(
      `Review due ${format(planReviewDeadlineDate, 'd MMM yyyy')}`,
    )
  })

  it.each([
    //
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.PLAN_OVERDUE,
    PlanActionStatus.REVIEW_OVERDUE,
    PlanActionStatus.REVIEW_DUE,
    PlanActionStatus.NEEDS_PLAN,
    PlanActionStatus.INACTIVE_PLAN,
    PlanActionStatus.PLAN_DECLINED,
    PlanActionStatus.NO_PLAN,
  ])(
    'should render the actions card component without the plan review due date given a plan status of %s',
    planStatus => {
      // Given
      const params = {
        ...templateParams,
        planStatus,
      }

      // When
      const content = nunjucks.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=plan-review-due-date]').length).toEqual(0)
    },
  )
})
