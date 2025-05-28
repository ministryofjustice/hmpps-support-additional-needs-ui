import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'

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

const prisonerSummary = aValidPrisonerSummary({
  firstName: 'IFEREECA',
  lastName: 'PEIGH',
})
const template = 'index.njk'

describe('Profile overview page', () => {
  it('should render the profile overview page', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(`Ifereeca Peigh's support for additional needs`)
    expect($('.prisoner-summary-banner').length).toEqual(1)
    expect($('[data-qa=additional-needs-summary-card]').length).toEqual(1)
    expect($('[data-qa=conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=support-recommendations-summary-card]').length).toEqual(1)
  })
})
