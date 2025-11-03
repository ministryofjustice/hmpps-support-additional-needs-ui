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
    this.nonAlnCStrengths().eq(zeroIndexed(index)).find('[data-qa=edit-strength-button]').click()
    return Page.verifyOnPage(StrengthDetailPage)
  }

  hasStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).should('be.visible')
    return this
  }

  hasNoStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).should('not.exist')
    return this
  }

  hasNonAlnStrengths(category: StrengthCategory, ...strengthType: Array<StrengthType>): StrengthsPage {
    strengthType.forEach(strength =>
      this.strengthCategorySummaryCard(category).find(`.non-aln-strength[data-qa=${strength}]`).should('be.visible'),
    )
    return this
  }

  hasNoNonAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).find(`.non-aln-strength`).should('not.exist')
    return this
  }

  hasAlnStrengths(category: StrengthCategory, ...strengths: Array<string>): StrengthsPage {
    this.strengthCategorySummaryCard(category)
      .find(`.aln-strengths li`)
      .then(listItems => {
        cy.wrap(listItems).should('have.length', strengths.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', strengths[index])
        })
      })
    return this
  }

  hasNoAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).find('.aln-strengths').should('not.exist')
    return this
  }

  hasNoActiveStrengths(): StrengthsPage {
    this.noStrengthsSummaryCard().should('be.visible')
    return this
  }

  private noStrengthsSummaryCard = (): PageElement => cy.get('[data-qa=no-strengths-summary-card]')

  private strengthCategorySummaryCard = (category: StrengthCategory): PageElement =>
    cy.get(`[data-qa=strengths-summary-card_${category}]`)

  private nonAlnCStrengths = (): PageElement => cy.get('.govuk-summary-list__row.non-aln-strength')
}
