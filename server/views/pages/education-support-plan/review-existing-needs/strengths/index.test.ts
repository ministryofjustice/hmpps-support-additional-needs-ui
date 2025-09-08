import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfToday } from 'date-fns'
import formatDate from '../../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import { aValidStrengthResponseDto } from '../../../../../testsupport/strengthResponseDtoTestDataBuilder'
import formatStrengthCategoryScreenValueFilter from '../../../../../filters/formatStrengthCategoryFilter'
import formatStrengthIdentificationSourceScreenValueFilter from '../../../../../filters/formatStrengthIdentificationSourceFilter'
import { formatStrengthTypeScreenValueFilter } from '../../../../../filters/formatStrengthTypeFilter'
import StrengthType from '../../../../../enums/strengthType'
import StrengthCategory from '../../../../../enums/strengthCategory'

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
  .addFilter('formatStrengthCategoryScreenValue', formatStrengthCategoryScreenValueFilter)
  .addFilter('formatStrengthIdentificationSourceScreenValue', formatStrengthIdentificationSourceScreenValueFilter)
  .addFilter('formatStrengthTypeScreenValue', formatStrengthTypeScreenValueFilter)

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
  groupedStrengths: Result.fulfilled({}),
  prisonNamesById: Result.fulfilled(prisonNamesById),
}

describe('Create ELSP - review existing strengths page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Review Strengths page', () => {
    // Given
    const params = {
      ...templateParams,
      groupedStrengths: Result.fulfilled({
        LITERACY_SKILLS: {
          nonAlnStrengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.READING,
              strengthCategory: StrengthCategory.LITERACY_SKILLS,
            }),
          ],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            strengths: [],
          },
        },
        NUMERACY_SKILLS: {
          nonAlnStrengths: [],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            strengths: [
              aValidStrengthResponseDto({
                strengthTypeCode: StrengthType.ARITHMETIC,
                strengthCategory: StrengthCategory.NUMERACY_SKILLS,
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
    expect($('[data-qa=strengths-summary-card_LITERACY_SKILLS]').length).toEqual(1)
    expect($('[data-qa=strengths-summary-card_NUMERACY_SKILLS]').length).toEqual(1)
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(0)
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Strengths page given prisoner has no Strengths', () => {
    // Given
    const params = {
      ...templateParams,
      groupedStrengths: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Strengths page given the Strengths service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      groupedStrengths: Result.rejected(new Error('Failed to get strengths')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=no-strengths-summary-card]').length).toEqual(0)
  })
})
