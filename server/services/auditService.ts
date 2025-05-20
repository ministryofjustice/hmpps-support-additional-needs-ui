import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  SEARCH = 'SEARCH',
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
