import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'
import ChallengeDetailPage from '../challenges/challengeDetailPage'
import zeroIndexed from '../../utils/zeroIndexed'
import ArchiveChallengeReasonPage from '../challenges/archiveChallengeReasonPage'

export default class ChallengesPage extends ProfilePage {
  constructor() {
    super('profile-challenges')
    this.activeTabIs('Challenges')
  }

  clickToEditNthNonAlnChallenge(index: number): ChallengeDetailPage {
    this.nonAlnChallenges().eq(zeroIndexed(index)).find('[data-qa=edit-challenge-button]').click()
    return Page.verifyOnPage(ChallengeDetailPage)
  }

  clickToArchiveNthNonAlnChallenge(index: number): ArchiveChallengeReasonPage {
    this.nonAlnChallenges().eq(zeroIndexed(index)).find('[data-qa=archive-challenge-button]').click()
    return Page.verifyOnPage(ArchiveChallengeReasonPage)
  }

  hasActiveChallengesSummaryCard(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: true }).should('be.visible')
    return this
  }

  hasArchivedChallengesSummaryCard(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: false }).should('be.visible')
    return this
  }

  hasNoActiveChallengesSummaryCard(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: true }).should('not.exist')
    return this
  }

  hasNoArchivedChallengesSummaryCard(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: false }).should('not.exist')
    return this
  }

  hasActiveNonAlnChallenges(category: ChallengeCategory, ...challengeType: Array<ChallengeType>): ChallengesPage {
    challengeType.forEach(challenge =>
      this.challengeCategorySummaryCard({ category, active: true })
        .find(`.non-aln-challenge[data-qa=${challenge}]`)
        .should('be.visible'),
    )
    return this
  }

  hasArchivedNonAlnChallenges(category: ChallengeCategory, ...challengeType: Array<ChallengeType>): ChallengesPage {
    challengeType.forEach(challenge =>
      this.challengeCategorySummaryCard({ category, active: false })
        .find(`.non-aln-challenge[data-qa=${challenge}]`)
        .should('be.visible'),
    )
    return this
  }

  hasNoActiveNonAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: true }).find('.non-aln-challenge').should('not.exist')
    return this
  }

  hasNoArchivedNonAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: false }).find('.non-aln-challenge').should('not.exist')
    return this
  }

  hasActiveAlnChallenges(category: ChallengeCategory, ...challenges: Array<string>): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: true })
      .find('.aln-challenges li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', challenges.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', challenges[index])
        })
      })
    return this
  }

  hasArchivedAlnChallenges(category: ChallengeCategory, ...challenges: Array<string>): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: false })
      .find('.aln-challenges li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', challenges.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', challenges[index])
        })
      })
    return this
  }

  hasNoActiveAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: true }).find('.aln-challenges').should('not.exist')
    return this
  }

  hasNoArchivedAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard({ category, active: false }).find('.aln-challenges').should('not.exist')
    return this
  }

  hasNoActiveChallenges(): ChallengesPage {
    this.noChallengesMessage({ active: true }).should('be.visible')
    return this
  }

  hasNoArchivedChallenges(): ChallengesPage {
    this.noChallengesMessage({ active: false }).should('be.visible')
    return this
  }

  private noChallengesMessage = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=no-${options.active ? 'active' : 'archived'}-challenges-message]`)

  private challengeCategorySummaryCard = (options: { category: ChallengeCategory; active: boolean }): PageElement =>
    cy.get(`[data-qa=${options.active ? 'active' : 'archived'}-challenges-summary-card-${options.category}]`)

  private nonAlnChallenges = (): PageElement => cy.get('.govuk-summary-list__row.non-aln-challenge')
}
