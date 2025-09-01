import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import { Result } from '../../../../utils/result/result'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import formatYesNoFilter from '../../../../filters/formatYesNoFilter'
import aPlanLifecycleStatusDto from '../../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import PlanActionStatus from '../../../../enums/planActionStatus'

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
  .addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('formatYesNo', formatYesNoFilter)

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
  tab: 'eucation-support-plan',
  prisonNamesById: Result.fulfilled(prisonNamesById),
  educationSupportPlan: Result.fulfilled(aValidEducationSupportPlanDto()),
  educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
  pageHasApiErrors: false,
  userHasPermissionTo,
}

describe('Profile education support plan page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile education and support plan page given the prisoner has an ELSP with answers that asked for no textual data', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlan: Result.fulfilled(
        aValidEducationSupportPlanDto({
          planCreatedByOther: null,
          otherPeopleConsulted: [],
          teachingAdjustments: null,
          specificTeachingSkills: null,
          examArrangements: null,
          lnspSupport: null,
          lnspSupportHours: null,
          additionalInformation: null,
          hasCurrentEhcp: false,
          individualSupport: 'Ifereeca has asked that he is not sat with disruptive people as he is keen to learn', // this is the only mandatory text field in the Create ELSP journey
          createdByDisplayName: 'Mr Plan CreatedBy',
          createdAt: startOfDay('2025-11-03'),
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=teaching-adjustments]').text().trim()).toEqual('None')
    expect($('[data-qa=specific-teaching-skills]').text().trim()).toEqual('None')
    expect($('[data-qa=exam-arrangements]').text().trim()).toEqual('None')
    expect($('[data-qa=lnsp-support]').text().trim()).toEqual('None')
    expect($('[data-qa=additional-information]').text().trim()).toEqual('None')
    expect($('[data-qa=education-health-care-plan]').text().trim()).toEqual('No')
    expect($('[data-qa=individual-support-requirements]').parent().find('dt').text().trim()).toEqual(
      `Ifereeca Peigh's view on the support needed`,
    )
    expect($('[data-qa=individual-support-requirements]').text().trim()).toEqual(
      'Ifereeca has asked that he is not sat with disruptive people as he is keen to learn',
    )
    expect($('[data-qa=plan-recorded-by]').text().trim()).toEqual('Mr Plan CreatedBy')
    expect($('[data-qa=plan-created-by]').text().trim()).toEqual('Mr Plan CreatedBy')
    expect($('[data-qa=plan-created-on]').text().trim()).toEqual('3 Nov 2025')
    expect($('[data-qa=plan-people-consulted]').text().trim()).toEqual('No')

    expect($('[data-qa=inactive-plan-notification]').length).toEqual(0)

    expect($('[data-qa=elsp-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile education and support plan page given the prisoner has an ELSP with answers to all questions', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlan: Result.fulfilled(
        aValidEducationSupportPlanDto({
          planCreatedByOther: { name: 'Mr Plan CreatedByOther', jobRole: 'Education Instructor' },
          otherPeopleConsulted: [
            { name: 'Person 1', jobRole: 'Teacher' },
            { name: 'Person 2', jobRole: 'Peer Mentor' },
          ],
          teachingAdjustments: 'Use simpler examples to help students understand concepts',
          specificTeachingSkills: 'Teacher with BSL proficiency required',
          examArrangements: 'Escort to the exam room 10 minutes before everyone else',
          lnspSupport: 'Ifereeca will need text reading to him as he cannot read himself',
          lnspSupportHours: 15,
          additionalInformation: 'Ifereeca is very open about his issues and is a pleasure to talk to.',
          hasCurrentEhcp: true,
          individualSupport: 'Ifereeca has asked that he is not sat with disruptive people as he is keen to learn', // this is the only mandatory text field in the Create ELSP journey
          createdByDisplayName: 'Mr Plan CreatedBy',
          createdAt: startOfDay('2025-11-03'),
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=teaching-adjustments]').text().trim()).toEqual(
      'Use simpler examples to help students understand concepts',
    )
    expect($('[data-qa=specific-teaching-skills]').text().trim()).toEqual('Teacher with BSL proficiency required')
    expect($('[data-qa=exam-arrangements]').text().trim()).toEqual(
      'Escort to the exam room 10 minutes before everyone else',
    )
    expect($('[data-qa=lnsp-support]').text().trim()).toContain(
      'Ifereeca will need text reading to him as he cannot read himself',
    )
    expect($('[data-qa=lnsp-support]').text().trim()).toContain('Recommended hours: 15')
    expect($('[data-qa=additional-information]').text().trim()).toEqual(
      'Ifereeca is very open about his issues and is a pleasure to talk to.',
    )
    expect($('[data-qa=education-health-care-plan]').text().trim()).toEqual('Yes')
    expect($('[data-qa=individual-support-requirements]').parent().find('dt').text().trim()).toEqual(
      `Ifereeca Peigh's view on the support needed`,
    )
    expect($('[data-qa=individual-support-requirements]').text().trim()).toEqual(
      'Ifereeca has asked that he is not sat with disruptive people as he is keen to learn',
    )
    expect($('[data-qa=plan-recorded-by]').text().trim()).toEqual('Mr Plan CreatedBy')
    expect($('[data-qa=plan-created-by]').text().trim()).toEqual('Mr Plan CreatedByOther (Education Instructor)')
    expect($('[data-qa=plan-created-on]').text().trim()).toEqual('3 Nov 2025')
    expect($('[data-qa=plan-people-consulted] li').eq(0).text().trim()).toEqual('Person 1 (Teacher)')
    expect($('[data-qa=plan-people-consulted] li').eq(1).text().trim()).toEqual('Person 2 (Peer Mentor)')

    expect($('[data-qa=inactive-plan-notification]').length).toEqual(0)

    expect($('[data-qa=elsp-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile education and support plan page given the prisoner has an ELSP but the lifecycle status is INACTIVE_PLAN', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlan: Result.fulfilled(aValidEducationSupportPlanDto()),
      educationSupportPlanLifecycleStatus: Result.fulfilled(
        aPlanLifecycleStatusDto({ status: PlanActionStatus.INACTIVE_PLAN }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=inactive-plan-notification]').length).toEqual(1)
    expect($('[data-qa=inactive-plan-notification] .govuk-notification-banner__content').text().trim()).toEqual(
      'Ifereeca Peigh is no longer eligible for an education support plan',
    )
    expect($('[data-qa=education-support-plan-summary-card]').length).toEqual(1)
    expect($('[data-qa=elsp-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile education and support plan page given the prisoner does not have an ELSP and the Plan Lifecycle status does not require a plan is created', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlan: Result.fulfilled(null),
      educationSupportPlanLifecycleStatus: Result.fulfilled(
        aPlanLifecycleStatusDto({ status: PlanActionStatus.NO_PLAN }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const summaryCardContent = $('[data-qa=education-support-plan-summary-card] .govuk-summary-card__content')
    expect(summaryCardContent.text().trim()).toContain('No education support plan recorded')
    expect(summaryCardContent.text().trim()).not.toContain('Create an education support plan')
    expect($('[data-qa=inactive-plan-notification]').length).toEqual(0)
    expect($('[data-qa=elsp-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it.each([
    //
    PlanActionStatus.PLAN_DUE,
    PlanActionStatus.PLAN_OVERDUE,
  ])(
    'should render the profile education and support plan page given the prisoner does not have an ELSP and the Plan Lifecycle status requires a plan is created',
    status => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlan: Result.fulfilled(null),
        educationSupportPlanLifecycleStatus: Result.fulfilled(
          aPlanLifecycleStatusDto({ status, planCreationDeadlineDate: startOfDay('2025-11-03') }),
        ),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCardContent = $('[data-qa=education-support-plan-summary-card] .govuk-summary-card__content')
      expect(summaryCardContent.text().trim()).toContain('No education support plan recorded')
      expect(summaryCardContent.text().trim()).toContain('Create an education support plan by 3 Nov 2025')
      expect($('[data-qa=inactive-plan-notification]').length).toEqual(0)
      expect($('[data-qa=elsp-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=api-error-banner]').length).toEqual(0)
    },
  )

  it('should render the profile education and support plan page given the ELSP promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlan: Result.rejected(new Error('Failed to get ELSP')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=elsp-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })

  it('should render the profile education and support plan page given the Plan Lifecycle Status promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlanLifecycleStatus: Result.rejected(new Error('Failed to get Plan Lifecycle Status')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=elsp-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
