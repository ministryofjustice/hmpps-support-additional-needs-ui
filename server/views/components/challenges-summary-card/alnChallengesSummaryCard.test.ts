import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { AlnScreenerResponseDto } from 'dto'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../filters/formatChallengeIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../filters/formatChallengeTypeFilter'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../../enums/challengeType'
import ChallengeCategory from '../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../enums/challengeIdentificationSource'
import challengeStaffSupportTextLookupFilter from '../../../filters/challengeStaffSupportTextLookupFilter'
import { aValidAlnScreenerResponseDto } from '../../../testsupport/alnScreenerDtoTestDataBuilder'

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

const alnTemplate = 'alnChallengesSummaryCard.test.njk'

describe('Tests for ALN Challenges Summary Card component', () => {
  it('should not render the aln component given no ALN screener', () => {
    // Given
    const latestAlnScreener: AlnScreenerResponseDto = null

    // When
    const content = njkEnv.render(alnTemplate, latestAlnScreener)

    // Then
    expect(content.trim()).toEqual('')
  })

  it('should not render the aln component given an ALN screener with no challenges', () => {
    // Given
    const latestAlnScreener = aValidAlnScreenerResponseDto({ challenges: null })

    // When
    const content = njkEnv.render(alnTemplate, latestAlnScreener)

    // Then
    expect(content.trim()).toEqual('')
  })

  it('should render the component given a ALN Challenge', () => {
    // Given
    const latestAlnScreener = aValidAlnScreenerResponseDto({
      createdAtPrison: 'BXI',
      screenerDate: parseISO('2025-02-12'),
      challenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.COMMUNICATION,
          challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
          symptoms: 'Talking is hard',
          howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
          howIdentifiedOther: null,
          fromALNScreener: true,
          createdByDisplayName: 'Person 3',
          createdAtPrison: 'BXI',
          createdAt: parseISO('2025-02-13'),
          updatedAt: parseISO('2025-02-15'),
          updatedByDisplayName: 'Person 3',
          updatedAtPrison: 'BXI',
          alnScreenerDate: parseISO('2025-02-12'),
        }),
      ],
    })

    // When
    const content = njkEnv.render(alnTemplate, {
      alnChallenges: latestAlnScreener,
      prisonNamesById: { BXI: 'Brixton (HMP)' },
    })
    const $ = cheerio.load(content)

    // Then
    // assert ALN Challenge details
    const challengeRow = $('.govuk-summary-list__row')
    expect(challengeRow.length).toEqual(1)

    const challengeRowElement = challengeRow.eq(0)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail]').length).toEqual(1)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] summary').eq(0).text().trim()).toEqual(
      'Communication',
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] div').eq(0).text().trim()).toEqual(
      challengeStaffSupportTextLookupFilter(ChallengeType.COMMUNICATION),
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 12 February 2025, Brixton (HMP)',
    )
  })

  it('should render multiple details for each ALN Challenge', () => {
    // Given
    const latestAlnScreener = aValidAlnScreenerResponseDto({
      challenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.COMMUNICATION,
          challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
          symptoms: 'Talking is hard',
          howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
          howIdentifiedOther: null,
          fromALNScreener: true,
          createdByDisplayName: 'Person 3',
          createdAtPrison: 'BXI',
          createdAt: parseISO('2025-02-13'),
          updatedAt: parseISO('2025-02-15'),
          updatedByDisplayName: 'Person 3',
        }),
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.HANDWRITING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Talking is hard',
          howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
          howIdentifiedOther: null,
          fromALNScreener: true,
          createdByDisplayName: 'Person 3',
          createdAtPrison: 'BXI',
          createdAt: parseISO('2025-02-13'),
          updatedAt: parseISO('2025-02-15'),
          updatedByDisplayName: 'Person 3',
        }),
      ],
    })

    // When
    const content = njkEnv.render(alnTemplate, { alnChallenges: latestAlnScreener })
    const $ = cheerio.load(content)

    // Then
    // assert ALN Challenge details
    const challengeRow = $('.govuk-summary-list__row')
    expect(challengeRow.length).toEqual(1)

    const challengeRowElement = challengeRow.eq(0)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail]').length).toEqual(2)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] summary').eq(0).text().trim()).toEqual(
      'Communication',
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] div').eq(0).text().trim()).toEqual(
      challengeStaffSupportTextLookupFilter(ChallengeType.COMMUNICATION),
    )
    // Verify the second details for the second challenge
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] summary').eq(1).text().trim()).toEqual(
      'Handwriting',
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] div').eq(1).text().trim()).toEqual(
      challengeStaffSupportTextLookupFilter(ChallengeType.HANDWRITING),
    )
  })
})
