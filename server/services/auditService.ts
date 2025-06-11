import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR',
  SEARCH = 'SEARCH',
  PROFILE_OVERVIEW = 'PROFILE_OVERVIEW',
  CREATE_ELSP_WHO_CREATED_PLAN = 'CREATE_ELSP_WHO_CREATED_PLAN',
  CREATE_ELSP_OTHER_PEOPLE_CONSULTED = 'CREATE_ELSP_OTHER_PEOPLE_CONSULTED',
  CREATE_ELSP_OTHER_PEOPLE_CONSULTED_ADD_PERSON = 'CREATE_ELSP_OTHER_PEOPLE_CONSULTED_ADD_PERSON',
  CREATE_ELSP_OTHER_PEOPLE_CONSULTED_LIST = 'CREATE_ELSP_OTHER_PEOPLE_CONSULTED_LIST',
  CREATE_ELSP_REVIEW_NEEDS_CONDITIONS_AND_STRENGTHS = 'CREATE_ELSP_REVIEW_NEEDS_CONDITIONS_AND_STRENGTHS',
  CREATE_ELSP_TEACHING_ADJUSTMENTS = 'CREATE_ELSP_TEACHING_ADJUSTMENTS',
  CREATE_ELSP_LEARNING_ENVIRONMENT_ADJUSTMENTS = 'CREATE_ELSP_LEARNING_ENVIRONMENT_ADJUSTMENTS',
  CREATE_ELSP_SPECIFIC_TEACHING_SKILLS = 'CREATE_ELSP_SPECIFIC_TEACHING_SKILLS',
  CREATE_ELSP_EXAM_ARRANGEMENTS = 'CREATE_ELSP_EXAM_ARRANGEMENTS',
  CREATE_ELSP_EDUCATION_HEALTH_CARE_PLAN = 'CREATE_ELSP_EDUCATION_HEALTH_CARE_PLAN',
  CREATE_ELSP_LNSP_SUPPORT = 'CREATE_ELSP_LNSP_SUPPORT',
  CREATE_ELSP_SET_REVIEW_DATE = 'CREATE_ELSP_SET_REVIEW_DATE',
  CREATE_ELSP_CHECK_YOUR_ANSWERS = 'CREATE_ELSP_CHECK_YOUR_ANSWERS',
}

enum AuditableUserAction {
  PAGE_VIEW_ATTEMPT = 'PAGE_VIEW_ATTEMPT',
  PAGE_VIEW = 'PAGE_VIEW',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    return this.hmppsAuditClient.sendMessage(event, false)
  }

  async logPageViewAttempt(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `${AuditableUserAction.PAGE_VIEW_ATTEMPT}_${page}`,
    }
    return this.logAuditEvent(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `${AuditableUserAction.PAGE_VIEW}_${page}`,
    }
    return this.logAuditEvent(event)
  }
}
