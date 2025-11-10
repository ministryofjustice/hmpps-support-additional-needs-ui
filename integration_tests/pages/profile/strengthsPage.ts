import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import StrengthCategory from '../../../server/enums/strengthCategory'
import StrengthType from '../../../server/enums/strengthType'
import zeroIndexed from '../../utils/zeroIndexed'
import StrengthDetailPage from '../strengths/strengthDetailPage'

export default class StrengthsPage extends ProfilePage {
  constructor() {
    super('profile-strengths')
    this.activeTabIs('Strengths')
  }

  clickToEditNthNonAlnStrength(index: number): StrengthDetailPage {
    this.nonAlnStrengths().eq(zeroIndexed(index)).find('[data-qa=edit-strength-button]').click()
    return Page.verifyOnPage(StrengthDetailPage)
  }

  hasActiveStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: true }).should('be.visible')
    return this
  }

  hasArchivedStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: false }).should('be.visible')
    return this
  }

  doesNotHaveActiveStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: true }).should('not.exist')
    return this
  }

  doesNotHaveArchivedStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: false }).should('not.exist')
    return this
  }

  hasActiveNonAlnStrengths(category: StrengthCategory, ...strengthType: Array<StrengthType>): StrengthsPage {
    strengthType.forEach(strength =>
      this.strengthCategorySummaryCard({ category, active: true })
        .find(`.non-aln-strength[data-qa=${strength}]`)
        .should('be.visible'),
    )
    return this
  }

  hasArchivedNonAlnStrengths(category: StrengthCategory, ...strengthType: Array<StrengthType>): StrengthsPage {
    strengthType.forEach(strength =>
      this.strengthCategorySummaryCard({ category, active: false })
        .find(`.non-aln-strength[data-qa=${strength}]`)
        .should('be.visible'),
    )
    return this
  }

  hasNoActiveNonAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: true }).find(`.non-aln-strength`).should('not.exist')
    return this
  }

  hasNoArchivedNonAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: false }).find(`.non-aln-strength`).should('not.exist')
    return this
  }

  hasActiveAlnStrengths(category: StrengthCategory, ...strengths: Array<string>): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: true })
      .find(`.aln-strengths li`)
      .then(listItems => {
        cy.wrap(listItems).should('have.length', strengths.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', strengths[index])
        })
      })
    return this
  }

  hasArchivedAlnStrengths(category: StrengthCategory, ...strengths: Array<string>): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: false })
      .find(`.aln-strengths li`)
      .then(listItems => {
        cy.wrap(listItems).should('have.length', strengths.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', strengths[index])
        })
      })
    return this
  }

  hasNoActiveAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: true }).find('.aln-strengths').should('not.exist')
    return this
  }

  hasNoArchivedAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard({ category, active: false }).find('.aln-strengths').should('not.exist')
    return this
  }

  hasNoActiveStrengths(): StrengthsPage {
    this.noStrengthsMessage({ active: true }).should('be.visible')
    return this
  }

  hasNoArchivedStrengths(): StrengthsPage {
    this.noStrengthsMessage({ active: false }).should('be.visible')
    return this
  }

  private noStrengthsMessage = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=no-${options.active ? 'active' : 'archived'}-strengths-message]`)

  private strengthCategorySummaryCard = (options: { category: StrengthCategory; active: boolean }): PageElement =>
    cy.get(`[data-qa=${options.active ? 'active' : 'archived'}-strengths-summary-card_${options.category}]`)

  private nonAlnStrengths = (): PageElement => cy.get('.govuk-summary-list__row.non-aln-strength')
}
