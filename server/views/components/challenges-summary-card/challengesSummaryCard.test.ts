import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { ChallengeResponseDto } from 'dto'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../filters/formatChallengeIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../filters/formatChallengeTypeFilter'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../../enums/challengeType'
import ChallengeCategory from '../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../enums/challengeIdentificationSource'
import challengeStaffSupportTextLookupFilter from '../../../filters/challengeStaffSupportTextLookupFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatChallengeTypeScreenValue', formatChallengeTypeScreenValueFilter)
  .addFilter('formatChallengeIdentificationSourceScreenValue', formatChallengeIdentificationSourceScreenValueFilter)
  .addFilter('challengeSupportTextLookup', challengeStaffSupportTextLookupFilter)

const template = 'challengesSummaryCard.test.njk'

describe('Tests for non ALN Challenges Summary Card component', () => {
  it('should render the component given a non ALN Challenge', () => {
    // Given
    const challenge = aValidChallengeResponseDto({
      challengeTypeCode: ChallengeType.LANGUAGE_COMM_SKILLS_DEFAULT,
      challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
      symptoms: 'Talking is hard',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
      howIdentifiedOther: null,
      fromALNScreener: false,
      createdByDisplayName: 'Person 3',
      createdAtPrison: 'BXI',
      createdAt: parseISO('2025-02-13'),
      updatedAt: parseISO('2025-02-15'),
      updatedByDisplayName: 'Person 3',
      updatedAtPrison: 'BXI',
    })

    // When
    const content = njkEnv.render(template, { challenge, prisonNamesById: { BXI: 'Brixton (HMP)' } })
    const $ = cheerio.load(content)

    // Then
    // assert ALN Challenge details
    const challengeRow = $('.govuk-summary-list__row')
    expect(challengeRow.length).toEqual(1)

    const challengeRowElement = challengeRow.eq(0)
    expect(challengeRowElement.find('p').eq(0).text().trim()).toEqual('Talking is hard')
    expect(challengeRowElement.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(1)
    expect(challengeRowElement.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Through conversations with the individual',
    ) // CONVERSATIONS
    expect(challengeRowElement.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Added on 15 February 2025 by Person 3, Brixton (HMP)',
    )
  })

  it('should not render the non aln component given no challenges', () => {
    // Given
    const challenge: ChallengeResponseDto = null

    // When
    const content = njkEnv.render(template, { challenge })

    // Then
    expect(content.trim()).toEqual('')
  })
})
