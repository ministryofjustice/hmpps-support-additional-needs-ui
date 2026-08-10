import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { ChallengeResponseDto, SupportStrategyResponseDto } from 'dto'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../filters/formatChallengeTypeFilter'
import ChallengeType from '../../../enums/challengeType'
import ChallengeCategory from '../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../enums/challengeIdentificationSource'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../filters/formatChallengeIdentificationSourceFilter'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../enums/supportStrategyType'
import SupportStrategyCategory from '../../../enums/supportStrategyCategory'
import formatPrisonerNameFilter, { NameFormat } from '../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

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
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addGlobal('featureToggles', { sanDataDeletionEnabled: true })

const userHasPermissionTo = jest.fn()
const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  title: 'Literacy skills',
  archivedChallenges: [aValidChallengeResponseDto()],
  archivedSupportStrategies: [aValidSupportStrategyResponseDto()],
  prisonNamesById,
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
}

const template = 'archivedChallengesAndSupportSummaryCard.test.njk'

describe('Tests for Archived Challenges and Support Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given only archived challenges and no archived support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.WRITING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Hand-written text is well written and easy to read',
          howIdentified: [ChallengeIdentificationSource.COLLEAGUE_INFO, ChallengeIdentificationSource.OTHER],
          howIdentifiedOther: `I have seen and experienced John's written text before`,
          fromALNScreener: false,
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
          active: false,
          archiveReason: 'Challenge added for the wrong prisoner by mistake',
        }),
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.READING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Can read at speed',
          howIdentified: [ChallengeIdentificationSource.EDUCATION_SKILLS_WORK],
          howIdentifiedOther: null,
          fromALNScreener: false,
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
          active: false,
          archiveReason: 'Challenge added in error',
        }),
      ],
      archivedSupportStrategies: [] as Array<SupportStrategyResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(2)

    const firstChallenge = archivedChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=archived-challenge-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(firstChallenge.find('[data-qa=archived-challenge-reason]').text().trim()).toEqual(
      'Challenge added for the wrong prisoner by mistake',
    )

    const secondChallenge = archivedChallenges.eq(1)
    expect(secondChallenge.find('p').eq(0).text().trim()).toEqual('Can read at speed')
    expect(secondChallenge.find('[data-qa=archived-challenge-how-identified] li').length).toEqual(1)
    expect(secondChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Observed in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondChallenge.find('[data-qa=archived-challenge-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(secondChallenge.find('[data-qa=archived-challenge-reason]').text().trim()).toEqual(
      'Challenge added in error',
    )

    const archivedSupportStrategies = $('.govuk-summary-list__row.archived-support-strategy')
    expect(archivedSupportStrategies.length).toEqual(0)
    expect($('[data-qa=no-support-strategies]').length).toEqual(1)
  })

  it('should render the component given only archived support strategies and no archived challenges', () => {
    // Given
    const params = {
      ...templateParams,
      archivedSupportStrategies: [
        aValidSupportStrategyResponseDto({
          supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
          supportStrategyCategory: SupportStrategyCategory.LITERACY_SKILLS,
          details: 'John needs help to read and understand written text',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
          active: false,
          archiveReason: 'Support Strategy added for the wrong prisoner by mistake',
        }),
        aValidSupportStrategyResponseDto({
          supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
          supportStrategyCategory: SupportStrategyCategory.LITERACY_SKILLS,
          details: 'John needs books with large print and simplified language',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
          active: false,
          archiveReason: 'Support Strategy added in error',
        }),
      ],
      archivedChallenges: [] as Array<ChallengeResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(0)
    expect($('[data-qa=no-challenges]').length).toEqual(1)

    const archivedSupportStrategies = $('.govuk-summary-list__row.archived-support-strategy')
    expect(archivedSupportStrategies.length).toEqual(2)

    const firstSupportStrategy = archivedSupportStrategies.eq(0)
    expect(firstSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'John needs help to read and understand written text',
    )
    expect(firstSupportStrategy.find('[data-qa=archived-support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(firstSupportStrategy.find('[data-qa=archived-support-strategy-reason]').text().trim()).toEqual(
      'Support Strategy added for the wrong prisoner by mistake',
    )

    const secondSupportStrategy = archivedSupportStrategies.eq(1)
    expect(secondSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'John needs books with large print and simplified language',
    )
    expect(secondSupportStrategy.find('[data-qa=archived-support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(secondSupportStrategy.find('[data-qa=archived-support-strategy-reason]').text().trim()).toEqual(
      'Support Strategy added in error',
    )
  })

  it('should render the component given archived challenges and archived support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.WRITING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Hand-written text is well written and easy to read',
          howIdentified: [ChallengeIdentificationSource.COLLEAGUE_INFO, ChallengeIdentificationSource.OTHER],
          howIdentifiedOther: `I have seen and experienced John's written text before`,
          fromALNScreener: false,
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
          active: false,
          archiveReason: 'Challenge added for the wrong prisoner by mistake',
        }),
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.READING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Can read at speed',
          howIdentified: [ChallengeIdentificationSource.EDUCATION_SKILLS_WORK],
          howIdentifiedOther: null,
          fromALNScreener: false,
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
          active: false,
          archiveReason: 'Challenge added in error',
        }),
      ],
      archivedSupportStrategies: [
        aValidSupportStrategyResponseDto({
          supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
          supportStrategyCategory: SupportStrategyCategory.LITERACY_SKILLS,
          details: 'John needs help to read and understand written text',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
          active: false,
          archiveReason: 'Support Strategy added for the wrong prisoner by mistake',
        }),
        aValidSupportStrategyResponseDto({
          supportStrategyCategoryTypeCode: SupportStrategyType.LITERACY_SKILLS_DEFAULT,
          supportStrategyCategory: SupportStrategyCategory.LITERACY_SKILLS,
          details: 'John needs books with large print and simplified language',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
          active: false,
          archiveReason: 'Support Strategy added in error',
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(2)

    const firstChallenge = archivedChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=archived-challenge-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(firstChallenge.find('[data-qa=archived-challenge-reason]').text().trim()).toEqual(
      'Challenge added for the wrong prisoner by mistake',
    )

    const secondChallenge = archivedChallenges.eq(1)
    expect(secondChallenge.find('p').eq(0).text().trim()).toEqual('Can read at speed')
    expect(secondChallenge.find('[data-qa=archived-challenge-how-identified] li').length).toEqual(1)
    expect(secondChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Observed in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondChallenge.find('[data-qa=archived-challenge-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(secondChallenge.find('[data-qa=archived-challenge-reason]').text().trim()).toEqual(
      'Challenge added in error',
    )

    const archivedSupportStrategies = $('.govuk-summary-list__row.archived-support-strategy')
    expect(archivedSupportStrategies.length).toEqual(2)

    const firstSupportStrategy = archivedSupportStrategies.eq(0)
    expect(firstSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'John needs help to read and understand written text',
    )
    expect(firstSupportStrategy.find('[data-qa=archived-support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(firstSupportStrategy.find('[data-qa=archived-support-strategy-reason]').text().trim()).toEqual(
      'Support Strategy added for the wrong prisoner by mistake',
    )

    const secondSupportStrategy = archivedSupportStrategies.eq(1)
    expect(secondSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'John needs books with large print and simplified language',
    )
    expect(secondSupportStrategy.find('[data-qa=archived-support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(secondSupportStrategy.find('[data-qa=archived-support-strategy-reason]').text().trim()).toEqual(
      'Support Strategy added in error',
    )
  })

  it('should render delete challenge action given the user only has permission to delete challenges', () => {
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(1)
    expect(archivedChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(archivedChallenges.eq(0).find('[data-qa=delete-archived-challenge-button]').length).toEqual(1)

    const archivedSupportStrategies = $('.govuk-summary-list__row.archived-support-strategy')
    expect(archivedSupportStrategies.length).toEqual(1)
    expect(archivedSupportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(archivedSupportStrategies.eq(0).find('[data-qa=delete-archived-support-strategy-button]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
  })

  it('should render delete support strategy action given the user only has permission to delete support strategies', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(1)
    expect(archivedChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(archivedChallenges.eq(0).find('[data-qa=delete-archived-challenge-button]').length).toEqual(0)

    const archivedSupportStrategies = $('.govuk-summary-list__row.archived-support-strategy')
    expect(archivedSupportStrategies.length).toEqual(1)
    expect(archivedSupportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(archivedSupportStrategies.eq(0).find('[data-qa=delete-archived-support-strategy-button]').length).toEqual(1)

    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
  })

  it('should render both delete actions given the user has permission to delete both challenges and support strategies', () => {
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(1)
    expect(archivedChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(archivedChallenges.eq(0).find('[data-qa=delete-archived-challenge-button]').length).toEqual(1)

    const archivedSupportStrategies = $('.govuk-summary-list__row.archived-support-strategy')
    expect(archivedSupportStrategies.length).toEqual(1)
    expect(archivedSupportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(archivedSupportStrategies.eq(0).find('[data-qa=delete-archived-support-strategy-button]').length).toEqual(1)

    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
  })

  it('should not render the component given no challenges or support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallenges: [] as Array<ChallengeResponseDto>,
      archivedSupportStrategies: [] as Array<SupportStrategyResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
