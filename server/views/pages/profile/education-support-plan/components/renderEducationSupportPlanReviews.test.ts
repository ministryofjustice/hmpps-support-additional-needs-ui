import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { ReviewEducationSupportPlanDto } from 'dto'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../filters/formatPrisonerNameFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDate)
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))

const prisonerSummary = aValidPrisonerSummary({
  firstName: 'IFEREECA',
  lastName: 'PEIGH',
})
const template = 'renderEducationSupportPlanReviews.test.njk'

const templateParams = {
  prisonerSummary,
  educationSupportPlanReviews: [aValidReviewEducationSupportPlanDto()],
  educationSupportPlan: aValidEducationSupportPlanDto({
    individualSupport: 'Headphones to help him with noise.',
    createdAt: startOfDay('2025-04-10'),
  }),
}

describe('Education Support Plan Reviews component', () => {
  describe('Prisoner view on progress section', () => {
    it('should render the Education Support Plan Reviews component given only one review', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'Chris is pleased with his progress and is enthusiastic about his future',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCard = $('[data-qa=education-support-plan-review-individuals-view-on-progress-summary-card]')
      expect(summaryCard.find('p').eq(0).text().trim()).toEqual(
        'Chris is pleased with his progress and is enthusiastic about his future',
      )
      // 1 li for the learner's initial view on support needed (no previous review li items as there is only one review)
      expect(summaryCard.find('li').length).toEqual(1)
    })

    it('should render the Education Support Plan Reviews component given several reviews', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'Chris feels that he is not sure if he is making progress',
            createdAt: startOfDay('2025-08-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            prisonerDeclinedBeingPartOfReview: true,
            createdAt: startOfDay('2025-09-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'He feels he is making basic progress',
            createdAt: startOfDay('2025-10-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'Chris is pleased with his progress and is enthusiastic about his future',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCard = $('[data-qa=education-support-plan-review-individuals-view-on-progress-summary-card]')
      expect(summaryCard.find('p').eq(0).text().trim()).toEqual(
        'Chris is pleased with his progress and is enthusiastic about his future',
      )
      // 3 previous review li items + 1 learner's initial view li item
      expect(summaryCard.find('li').length).toEqual(4)
      expect(summaryCard.find('li').eq(0).find('p').eq(0).text().trim()).toEqual('He feels he is making basic progress')
      expect(summaryCard.find('li').eq(0).find('p').eq(1).text().trim()).toEqual('Added 3 Oct 2025')
      expect(summaryCard.find('li').eq(1).find('p').eq(0).text().trim()).toEqual('Prisoner refused review')
      expect(summaryCard.find('li').eq(1).find('p').eq(1).text().trim()).toEqual('Added 3 Sep 2025')
      expect(summaryCard.find('li').eq(2).find('p').eq(0).text().trim()).toEqual(
        'Chris feels that he is not sure if he is making progress',
      )
      expect(summaryCard.find('li').eq(2).find('p').eq(1).text().trim()).toEqual('Added 3 Aug 2025')
    })

    it("should render the Learner's initial view on support needed collapsible given one review", () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'Chris is pleased with his progress',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
        educationSupportPlan: aValidEducationSupportPlanDto({
          individualSupport: 'Headphones to help him with noise.',
          createdAt: startOfDay('2025-04-10'),
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCard = $('[data-qa=education-support-plan-review-individuals-view-on-progress-summary-card]')
      const detailsSummaries = summaryCard.find('.govuk-details__summary-text')
      expect(detailsSummaries.length).toEqual(1)
      expect(detailsSummaries.eq(0).text().trim()).toEqual("Learner's initial view on support needed")
      const detailsContent = summaryCard.find('.govuk-details__text').eq(0)
      expect(detailsContent.find('p').eq(0).text().trim()).toEqual('Headphones to help him with noise.')
      expect(detailsContent.find('p').eq(1).text().trim()).toEqual('Added 10 Apr 2025')
    })

    it("should render the Learner's initial view on support needed collapsible alongside previous views given several reviews", () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'First review progress',
            createdAt: startOfDay('2025-08-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            prisonerViewOnProgress: 'Second review progress',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
        educationSupportPlan: aValidEducationSupportPlanDto({
          individualSupport: 'Headphones to help him with noise.',
          createdAt: startOfDay('2025-04-10'),
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCard = $('[data-qa=education-support-plan-review-individuals-view-on-progress-summary-card]')
      const detailsSummaries = summaryCard.find('.govuk-details__summary-text')
      expect(detailsSummaries.length).toEqual(2)
      expect(detailsSummaries.eq(0).text().trim()).toEqual('Previous views on progress')
      expect(detailsSummaries.eq(1).text().trim()).toEqual("Learner's initial view on support needed")
    })
  })

  describe('Reviewers view on progress section', () => {
    it('should render the Education Support Plan Reviews component given only one review', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            reviewersViewOnProgress: 'Chris is making great progress',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCard = $('[data-qa=education-support-plan-review-reviewers-view-on-progress-summary-card]')
      expect(summaryCard.find('p').eq(0).text().trim()).toEqual('Chris is making great progress')
      expect(summaryCard.find('li').length).toEqual(0)
    })

    it('should render the Education Support Plan Reviews component given several reviews', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            reviewersViewOnProgress: 'Chris has not really started yet',
            createdAt: startOfDay('2025-08-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            reviewersViewOnProgress: 'Chris has made no progress yet',
            createdAt: startOfDay('2025-09-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            reviewersViewOnProgress: 'Chris has made a good start on his courses',
            createdAt: startOfDay('2025-10-03'),
          }),
          aValidReviewEducationSupportPlanDto({
            reviewersViewOnProgress: 'Chris is making great progress',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const summaryCard = $('[data-qa=education-support-plan-review-reviewers-view-on-progress-summary-card]')
      expect(summaryCard.find('p').eq(0).text().trim()).toEqual('Chris is making great progress')
      expect(summaryCard.find('li').length).toEqual(3)
      expect(summaryCard.find('li').eq(0).find('p').eq(0).text().trim()).toEqual(
        'Chris has made a good start on his courses',
      )
      expect(summaryCard.find('li').eq(0).find('p').eq(1).text().trim()).toEqual('Added 3 Oct 2025')
      expect(summaryCard.find('li').eq(1).find('p').eq(0).text().trim()).toEqual('Chris has made no progress yet')
      expect(summaryCard.find('li').eq(1).find('p').eq(1).text().trim()).toEqual('Added 3 Sep 2025')
      expect(summaryCard.find('li').eq(2).find('p').eq(0).text().trim()).toEqual('Chris has not really started yet')
      expect(summaryCard.find('li').eq(2).find('p').eq(1).text().trim()).toEqual('Added 3 Aug 2025')
    })
  })

  describe('Review audit fields section', () => {
    it('should render the Education Support Plan Reviews component given only one review where the review was carried out by the logged in user with no other contributors', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            planReviewedByOther: null,
            otherPeopleConsulted: [],
            createdByDisplayName: 'Mr Plan ReviewedBy',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=reviewed-by]').text().trim()).toEqual('Mr Plan ReviewedBy')
      expect($('[data-qa=review-recorded-by]').text().trim()).toEqual('Mr Plan ReviewedBy')
      expect($('[data-qa=reviewed-on]').text().trim()).toEqual('3 Nov 2025')
      expect($('[data-qa=review-people-consulted]').text().trim()).toEqual('No')
    })

    it('should render the Education Support Plan Reviews component given only one review where the review was carried out by someone else with other contributors', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({
            planReviewedByOther: { name: 'Mr Plan ReviewedByOther', jobRole: 'Education Instructor' },
            otherPeopleConsulted: [
              { name: 'Person 1', jobRole: 'Teacher' },
              { name: 'Person 2', jobRole: 'Peer Mentor' },
            ],
            createdByDisplayName: 'Mr Plan ReviewedBy',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=reviewed-by]').text().trim()).toEqual('Mr Plan ReviewedByOther (Education Instructor)')
      expect($('[data-qa=review-recorded-by]').text().trim()).toEqual('Mr Plan ReviewedBy')
      expect($('[data-qa=reviewed-on]').text().trim()).toEqual('3 Nov 2025')
      expect($('[data-qa=review-people-consulted] li').eq(0).text().trim()).toEqual('Person 1 (Teacher)')
      expect($('[data-qa=review-people-consulted] li').eq(1).text().trim()).toEqual('Person 2 (Peer Mentor)')
    })

    it('should render the Education Support Plan Reviews component using the most recent review for the audit fields', () => {
      // Given
      const params = {
        ...templateParams,
        educationSupportPlanReviews: [
          aValidReviewEducationSupportPlanDto({ createdAt: startOfDay('2025-08-03') }),
          aValidReviewEducationSupportPlanDto({ createdAt: startOfDay('2025-09-03') }),
          aValidReviewEducationSupportPlanDto({ createdAt: startOfDay('2025-10-03') }),
          aValidReviewEducationSupportPlanDto({
            planReviewedByOther: { name: 'Mr Plan ReviewedByOther', jobRole: 'Education Instructor' },
            otherPeopleConsulted: [
              { name: 'Person 1', jobRole: 'Teacher' },
              { name: 'Person 2', jobRole: 'Peer Mentor' },
            ],
            createdByDisplayName: 'Mr Plan ReviewedBy',
            createdAt: startOfDay('2025-11-03'),
          }),
        ],
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=reviewed-by]').text().trim()).toEqual('Mr Plan ReviewedByOther (Education Instructor)')
      expect($('[data-qa=review-recorded-by]').text().trim()).toEqual('Mr Plan ReviewedBy')
      expect($('[data-qa=reviewed-on]').text().trim()).toEqual('3 Nov 2025')
      expect($('[data-qa=review-people-consulted] li').eq(0).text().trim()).toEqual('Person 1 (Teacher)')
      expect($('[data-qa=review-people-consulted] li').eq(1).text().trim()).toEqual('Person 2 (Peer Mentor)')
    })
  })

  it('should not render the Education Support Plan Reviews component given no reviews', () => {
    // Given
    const params = {
      ...templateParams,
      educationSupportPlanReviews: [] as Array<ReviewEducationSupportPlanDto>,
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
