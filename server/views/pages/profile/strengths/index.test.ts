import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import {
  aValidStrengthResponseDto,
  aValidStrengthsList,
} from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'
import StrengthType from '../../../../enums/strengthType'

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

const prisonerSummary = aValidPrisonerSummary({
  firstName: 'IFEREECA',
  lastName: 'PEIGH',
})
const template = 'index.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  tab: 'strengths',
  strengths: Result.fulfilled(aValidStrengthsList()),
  pageHasApiErrors: false,
}

describe('Profile strengths page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile strengths page given prisoner has no active Strengths', () => {
    // Given
    const strengthList = aValidStrengthsList({
      strengths: [
        aValidStrengthResponseDto({ strengthTypeCode: StrengthType.ARITHMETIC, active: false }),
        aValidStrengthResponseDto({ strengthTypeCode: StrengthType.WRITING, active: false }),
        aValidStrengthResponseDto({ strengthTypeCode: StrengthType.READING, active: false }),
      ],
    })
    const params = {
      ...templateParams,
      strengths: Result.fulfilled(strengthList),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-strengths-summary-card] a').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
  })

  it('should render the profile strengths page given prisoner has no Strengths at all', () => {
    // Given
    const strengthList = aValidStrengthsList({ strengths: [] })
    const params = {
      ...templateParams,
      strengths: Result.fulfilled(strengthList),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-strengths-summary-card] a').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
  })

  it('should render the profile strengths page given prisoner has no Strengths and the user does not have permission to create Strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const strengthList = aValidStrengthsList({ strengths: [] })
    const params = {
      ...templateParams,
      strengths: Result.fulfilled(strengthList),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-strengths-summary-card] a').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
  })

  it('should render the profile strengths page given the Strengths service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      strengths: Result.rejected(new Error('Failed to get strengths')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
