import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfToday } from 'date-fns'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import formatChallengeCategoryScreenValueFilter from '../../../../filters/formatChallengeCategoryFilter'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../../filters/formatChallengeIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../../filters/formatChallengeTypeFilter'
import ChallengeType from '../../../../enums/challengeType'
import ChallengeCategory from '../../../../enums/challengeCategory'
import aPlanLifecycleStatusDto from '../../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import challengeStaffSupportTextLookupFilter from '../../../../filters/challengeStaffSupportTextLookupFilter'

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
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)
  .addFilter('formatChallengeIdentificationSourceScreenValue', formatChallengeIdentificationSourceScreenValueFilter)
  .addFilter('formatChallengeTypeScreenValue', formatChallengeTypeScreenValueFilter)
  .addFilter('challengeSupportTextLookup', challengeStaffSupportTextLookupFilter)

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
  tab: 'challenges',
  groupedChallenges: Result.fulfilled({}),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
  pageHasApiErrors: false,
}

describe('Profile challenges page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile challenges page', () => {
    // Given
    const params = {
      ...templateParams,
      groupedChallenges: Result.fulfilled({
        LITERACY_SKILLS: {
          nonAlnChallenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.READING,
              challengeCategory: ChallengeCategory.LITERACY_SKILLS,
            }),
          ],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [],
          },
        },
        NUMERACY_SKILLS: {
          nonAlnChallenges: [],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [
              aValidChallengeResponseDto({
                challengeTypeCode: ChallengeType.ARITHMETIC,
                challengeCategory: ChallengeCategory.NUMERACY_SKILLS,
              }),
            ],
          },
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=challenges-summary-card-LITERACY_SKILLS]').length).toEqual(1)
    expect($('[data-qa=challenges-summary-card-NUMERACY_SKILLS]').length).toEqual(1)
    expect($('[data-qa=no-challenges-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile challenges page given prisoner has no Challenges', () => {
    // Given
    const params = {
      ...templateParams,
      groupedChallenges: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-challenges-summary-card] a').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
  })

  it('should render the profile challenges page given prisoner has no Challenges and the user does not have permission to create Challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
      groupedChallenges: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-challenges-summary-card] a').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })

  it('should render the profile challenges page given the Challenges service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      groupedChallenges: Result.rejected(new Error('Failed to get challenges')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
