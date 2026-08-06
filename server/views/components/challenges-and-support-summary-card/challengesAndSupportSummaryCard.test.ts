import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO, startOfToday } from 'date-fns'
import type { ChallengeResponseDto, SupportStrategyResponseDto } from 'dto'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../filters/formatChallengeIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../filters/formatChallengeTypeFilter'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../../enums/challengeType'
import ChallengeCategory from '../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../enums/challengeIdentificationSource'
import challengeStaffSupportTextLookupFilter from '../../../filters/challengeStaffSupportTextLookupFilter'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../enums/supportStrategyType'
import SupportStrategyCategory from '../../../enums/supportStrategyCategory'

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
  .addGlobal('featureToggles', { sanDataDeletionEnabled: true })

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const userHasPermissionTo = jest.fn()
const templateParams = {
  title: 'Literacy skills',
  challengeAndSupportData: {
    nonAlnChallenges: [aValidChallengeResponseDto()],
    latestAlnScreener: {
      createdAtPrison: 'BXI',
      screenerDate: startOfToday(),
      challenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.SENSORY,
          challengeCategory: ChallengeCategory.SENSORY,
        }),
      ],
    },
    supportStrategies: [aValidSupportStrategyResponseDto()],
  },
  prisonNamesById,
  userHasPermissionTo,
}

const template = 'challengesAndSupportSummaryCard.test.njk'

describe('Tests for Challenges and Support Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given non-ALN, ALN challenges, and Support Strategies', () => {
    // Given
    const params = {
      ...templateParams,
      challengeAndSupportData: {
        nonAlnChallenges: [
          aValidChallengeResponseDto({
            challengeTypeCode: ChallengeType.WRITING,
            challengeCategory: ChallengeCategory.LITERACY_SKILLS,
            symptoms: 'Hand-written text is not neat and hard to read',
            howIdentified: [ChallengeIdentificationSource.COLLEAGUE_INFO, ChallengeIdentificationSource.OTHER],
            howIdentifiedOther: `I have seen and experienced John's written text before`,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:01:00'),
          }),
          aValidChallengeResponseDto({
            challengeTypeCode: ChallengeType.READING,
            challengeCategory: ChallengeCategory.LITERACY_SKILLS,
            symptoms: 'Is very slow at reading',
            howIdentified: [ChallengeIdentificationSource.EDUCATION_SKILLS_WORK],
            howIdentifiedOther: null,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:00:00'),
          }),
        ],
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          challenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.SENSORY,
              challengeCategory: ChallengeCategory.SENSORY,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
        supportStrategies: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
            supportStrategyCategory: SupportStrategyCategory.MEMORY,
            details: 'John needs to use flash cards to help with recalling fact',
            updatedByDisplayName: 'Person 4',
            updatedAtPrison: 'BXI',
            updatedAt: parseISO('2025-10-27'),
          }),
        ],
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(2)

    const firstChallenge = nonAlnChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is not neat and hard to read')
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    const secondChallenge = nonAlnChallenges.eq(1)
    expect(secondChallenge.find('p').eq(0).text().trim()).toEqual('Is very slow at reading')
    expect(secondChallenge.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(1)
    expect(secondChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Observed in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondChallenge.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(1)
    expect(alnChallenges.eq(0).find('summary').text().trim()).toEqual('Sensory') // SENSORY
    expect($('[data-qa=aln-challenges-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, Brixton (HMP)',
    )

    expect($('[data-qa=no-challenges]').length).toEqual(0)

    // assert Support Strategies
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    const firstSupportStrategy = supportStrategies.eq(0)
    expect(firstSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'John needs to use flash cards to help with recalling fact',
    )
    expect(firstSupportStrategy.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Last updated 27 Oct 2025 by Person 4, Brixton (HMP)',
    )
    expect($('[data-qa=no-support-strategies]').length).toEqual(0)
  })

  it('should render the component given only non-ALN challenges and no ALN Screener or Support Strategies', () => {
    // Given
    const params = {
      ...templateParams,
      challengeAndSupportData: {
        nonAlnChallenges: [
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
          }),
        ],
        latestAlnScreener: {},
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)

    const firstChallenge = nonAlnChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    expect($('[data-qa=no-challenges]').length).toEqual(0)

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(0)

    // assert Support Strategies
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(0)
    expect($('[data-qa=no-support-strategies]').length).toEqual(1)
  })

  it('should render the component given only ALN challenges and no non-ALN challenges or Support Strategies', () => {
    // Given
    const params = {
      ...templateParams,
      challengeAndSupportData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          challenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.SENSORY,
              challengeCategory: ChallengeCategory.SENSORY,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(0)

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(1)
    expect(alnChallenges.eq(0).find('summary').text().trim()).toEqual('Sensory') // SENSORY
    expect($('[data-qa=aln-challenges-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, Brixton (HMP)',
    )

    expect($('[data-qa=no-challenges]').length).toEqual(0)

    // assert Support Strategies
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(0)
    expect($('[data-qa=no-support-strategies]').length).toEqual(1)
  })

  it('should render the component given prisonNamesById does not contain the prison', () => {
    // Given
    const params = {
      ...templateParams,
      challengeAndSupportData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          challenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.SENSORY,
              challengeCategory: ChallengeCategory.SENSORY,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
      prisonNamesById: {},
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(0)

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(1)
    expect(alnChallenges.eq(0).find('summary').text().trim()).toEqual('Sensory') // SENSORY
    expect($('[data-qa=aln-challenges-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, BXI',
    )

    // assert Support Strategies
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(0)
    expect($('[data-qa=no-support-strategies]').length).toEqual(1)
  })

  it('should not render the component given no challenges and no support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      challengeAndSupportData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: startOfToday(),
          challenges: [] as Array<ChallengeResponseDto>,
        },
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })

  it('should not render any actions given the user does not have any permissions', () => {
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render delete challenge action given the user only has permission to delete challenges', () => {
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=delete-challenge-button]').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render edit challenge action given the user only has permission to edit challenges', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=delete-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render archive challenge action given the user only has permission to archive challenges', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=delete-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render all 3 challenge actions given the user has permissions to delete, edit and archive challenges', () => {
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        supportStrategies: [] as Array<SupportStrategyResponseDto>,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=delete-challenge-button]').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render delete support strategy action given the user only has permission to delete support strategies', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {},
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=delete-support-strategy-button]').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(0)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render edit support strategy given the user only has permission to edit support strategies', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {},
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=delete-support-strategy-button]').length).toEqual(0)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render archive support strategy given the user only has permission to archive support strategies', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {},
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=delete-support-strategy-button]').length).toEqual(0)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(0)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render all 3 support strategy actions given the user has permissions to delete, edit and archive support strategies', () => {
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      challengeAndSupportData: {
        ...templateParams.challengeAndSupportData,
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {},
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=delete-support-strategy-button]').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('DELETE_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should not render anything to do with Challenges given the Support Strategies are in the category GENERAL', () => {
    // Given
    const params = {
      ...templateParams,
      challengeAndSupportData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {},
        supportStrategies: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.GENERAL,
            details: 'John needs general help and support',
            updatedByDisplayName: 'Person 4',
            updatedAtPrison: 'BXI',
            updatedAt: parseISO('2025-10-27'),
          }),
        ],
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(0)

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(0)

    expect($('[data-qa=no-challenges]').length).toEqual(0)

    // assert Support Strategies
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    const firstSupportStrategy = supportStrategies.eq(0)
    expect(firstSupportStrategy.find('p').eq(0).text().trim()).toEqual('John needs general help and support')
    expect(firstSupportStrategy.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Last updated 27 Oct 2025 by Person 4, Brixton (HMP)',
    )
    expect($('[data-qa=no-support-strategies]').length).toEqual(0)
  })
})
