import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { PlanCreationScheduleDto } from 'dto'
import type { ActionsCardParams } from 'viewModels'
import formatDateFilter from '../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'
import PlanCreationScheduleStatus from '../../../enums/planCreationScheduleStatus'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)

const userHasPermissionTo = jest.fn()
const templateParams: ActionsCardParams = {
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
  educationSupportPlanCreationSchedule: aValidPlanCreationScheduleDto(),
}

describe('_educationSupportPlanActions', () => {
  it('should render support plan actions section given plan creation schedule status is SCHEDULED', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlanCreationSchedule: aValidPlanCreationScheduleDto({
        status: PlanCreationScheduleStatus.SCHEDULED,
      }),
    }

    // When
    const content = nunjucks.render('_educationSupportPlanActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-support-plan-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=education-support-plan-action-items] li').length).toEqual(2) // expect there to be 2 actions within
    expect($('[data-qa=education-support-plan-action-items] li:nth-of-type(1) a').attr('data-qa')).toEqual(
      'create-education-support-plan-button',
    ) // expect the 1st action to be Create ELSP
    expect($('[data-qa=education-support-plan-action-items] li:nth-of-type(2) a').attr('data-qa')).toEqual(
      'refuse-education-support-plan-button',
    ) // expect the 2nd action to be Refuse ELSP
  })

  it.each([
    PlanCreationScheduleStatus.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
    PlanCreationScheduleStatus.EXEMPT_PRISONER_TRANSFER,
    PlanCreationScheduleStatus.EXEMPT_PRISONER_RELEASE,
    PlanCreationScheduleStatus.EXEMPT_PRISONER_DEATH,
    PlanCreationScheduleStatus.EXEMPT_PRISONER_MERGE,
    PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
    PlanCreationScheduleStatus.EXEMPT_NOT_IN_EDUCATION,
    PlanCreationScheduleStatus.EXEMPT_UNKNOWN,
    PlanCreationScheduleStatus.COMPLETED,
  ])('should render support plan actions section given plan creation schedule status is %s', status => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlanCreationSchedule: aValidPlanCreationScheduleDto({ status }),
    }

    // When
    const content = nunjucks.render('_educationSupportPlanActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-support-plan-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=education-support-plan-action-items] li').length).toEqual(0) // expect there to be 0 actions within
  })

  it('should render support plan actions section given plan creation schedule is null', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlanCreationSchedule: null as PlanCreationScheduleDto,
    }

    // When
    const content = nunjucks.render('_educationSupportPlanActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-support-plan-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=education-support-plan-action-items] li').length).toEqual(0) // expect there to be 0 actions within
  })
})
