import { startOfDay } from 'date-fns'
import aValidEducationSupportPlanDto from '../../testsupport/educationSupportPlanDtoTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import { toSupportPlanReviewRequest } from './supportPlanReviewRequestMapper'

describe('supportPlanReviewRequestMapper', () => {
  const educationSupportPlanDto = aValidEducationSupportPlanDto({
    teachingAdjustments: 'Use simpler examples to help students understand concepts',
    specificTeachingSkills: 'Teacher with BSL proficiency required',
    examArrangements: 'Escort to the exam room 10 minutes before everyone else',
    lnspSupport: 'Chris will need text reading to him as he cannot read himself',
    lnspSupportHours: 10,
    additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
  })

  const reviewEducationSupportPlanDto = aValidReviewEducationSupportPlanDto({
    prisonNumber: 'A1234BC',
    prisonId: 'BXI',
    planReviewedByOther: { name: 'A Reviewer', jobRole: 'NSM' },
    otherPeopleConsulted: [
      {
        name: 'Person 1',
        jobRole: 'Teacher',
      },
      {
        name: 'Person 2',
        jobRole: 'Teaching Assistant',
      },
    ],
    prisonerViewOnProgress: 'Chris is happy with his progress',
    prisonerDeclinedBeingPartOfReview: false,
    reviewersViewOnProgress: 'I am happy with progress',
    reviewDate: startOfDay('2025-11-05'),
    teachingAdjustments: 'Use simpler examples to help students understand concepts',
    specificTeachingSkills: 'Teacher with BSL proficiency required',
    examArrangements: 'Escort to the exam room 10 minutes before everyone else',
    lnspSupport: 'Chris will need text reading to him as he cannot read himself',
    lnspSupportHours: 10,
    additionalInformation: 'Chris is very open about his issues and is a pleasure to talk to.',
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains review data but would make no effective changes to the Education Support Plan', () => {
    // Given
    const reviewDto = { ...reviewEducationSupportPlanDto }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: { anyChanges: false },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains a change to Teaching Adjustments in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      teachingAdjustments: 'Use simpler examples when explaining maths concepts',
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: 'Use simpler examples when explaining maths concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 10,
        detail: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains a change to Teaching Skills in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      specificTeachingSkills: 'Teacher with advanced BSL proficiency required',
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with advanced BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 10,
        detail: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains a change to Exam Access Arrangements in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      examArrangements: 'Escort to the exam room 20 minutes before everyone else to get him settled',
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 20 minutes before everyone else to get him settled',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 10,
        detail: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains a change to LNSP Support in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      lnspSupport: 'Chris will need text reading and explaining to him',
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading and explaining to him',
        lnspSupportHours: 10,
        detail: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains a change to LNSP Support Hours in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      lnspSupportHours: 15,
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 15,
        detail: 'Chris is very open about his issues and is a pleasure to talk to.',
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that contains a change to Additional Information in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      additionalInformation: 'Chris is feeling very positive about education',
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 10,
        detail: 'Chris is feeling very positive about education',
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to SupportPlanReviewRequest given a ReviewSupportPlanDto that deletes the data from all fields in the Education Support Plan', () => {
    // Given
    const reviewDto = {
      ...reviewEducationSupportPlanDto,
      teachingAdjustmentsNeeded: false,
      specificTeachingSkillsNeeded: false,
      examArrangementsNeeded: false,
      lnspSupportNeeded: false,
      additionalInformation: null as string,
    }

    const expected = {
      prisonId: 'BXI',
      nextReviewDate: '2025-11-05',
      reviewCreatedBy: { name: 'A Reviewer', jobRole: 'NSM' },
      otherContributors: [
        {
          name: 'Person 1',
          jobRole: 'Teacher',
        },
        {
          name: 'Person 2',
          jobRole: 'Teaching Assistant',
        },
      ],
      prisonerFeedback: 'Chris is happy with his progress',
      prisonerDeclinedFeedback: false,
      reviewerFeedback: 'I am happy with progress',
      updateEducationSupportPlan: {
        anyChanges: true,
        teachingAdjustments: null as string,
        specificTeachingSkills: null as string,
        examAccessArrangements: null as string,
        lnspSupport: null as string,
        lnspSupportHours: null as number,
        detail: null as string,
      },
    }

    // When
    const actual = toSupportPlanReviewRequest(reviewDto, educationSupportPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
