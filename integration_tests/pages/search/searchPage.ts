import Page, { PageElement } from '../page'
import OverviewPage from '../profile/overview/overviewPage'

export default class SearchPage extends Page {
  constructor() {
    super('search-page')
  }

  hasResultsDisplayed(expectedResultCount: number): SearchPage {
    this.searchResultsTable().should('be.visible')
    this.zeroResultsMessage().should('not.exist')
    this.paginationResultsCount().should('contain', ` of ${expectedResultCount} results`)
    return this
  }

  hasNoResultsDisplayed(): SearchPage {
    this.zeroResultsMessage().should('be.visible')
    this.searchResultsTable().should('not.exist')
    return this
  }

  hasNoSearchTerm(): SearchPage {
    this.searchTermField().should('be.empty')
    return this
  }

  hasSearchTerm(expected: string): SearchPage {
    this.searchTermField().should('have.value', expected)
    return this
  }

  setNameFilter(value: string): SearchPage {
    this.searchTermField().clear().type(value)
    return this
  }

  applyFilters(): SearchPage {
    this.applyFiltersButton().click()
    return this
  }

  clearFilters(): SearchPage {
    this.clearFiltersButton().click()
    return this
  }

  sortBy(field: 'name' | 'location' | 'release-date' | 'reception-date' | 'status'): SearchPage {
    this.sortableTableHeaders().find(`[data-qa=${field}-column-header] button`).click()
    return this
  }

  isSortedBy(
    field: 'name' | 'location' | 'release-date' | 'reception-date' | 'status',
    direction: 'ascending' | 'descending',
  ): SearchPage {
    this.sortableTableHeaders().find(`[data-qa=${field}-column-header]`).should('have.attr', 'aria-sort', direction)
    return this
  }

  gotoPage(value: number): SearchPage {
    this.paginationControls().find(`li:nth-of-type(${value}) a`).click()
    return this
  }

  paginationCurrentPageIs(value: number): SearchPage {
    this.paginationControls().find(`li:nth-of-type(${value})`).should('have.attr', 'aria-current', 'page')
    return this
  }

  hasPreviousLinkDisplayed(): SearchPage {
    this.paginationFirstLink().should('contain', 'Previous')
    return this
  }

  hasNextLinkDisplayed(): SearchPage {
    this.paginationLastLink().should('contain', 'Next')
    return this
  }

  hasPaginationLinkForPage(page: number): SearchPage {
    this.paginationControls().find(`li:nth-of-type(${page}) a`).should('contain', `${page}`)
    return this
  }

  searchUnavailableMessageIsNotDisplayed(): SearchPage {
    this.searchUnavailbleMessage().should('not.exist')
    return this
  }

  searchUnavailableMessageIsDisplayed(): SearchPage {
    this.searchUnavailbleMessage().should('be.visible')
    return this
  }

  gotoOverviewPageForPrisoner(prisonNumber: string): OverviewPage {
    this.searchResultsTable() //
      .find(`tr td:contains('${prisonNumber}')`)
      .parent()
      .find('td a')
      .click()
    return Page.verifyOnPage(OverviewPage)
  }

  private searchTermField = (): PageElement => cy.get('#searchTerm')

  private applyFiltersButton = (): PageElement => cy.get('[data-qa=apply-filters]')

  private clearFiltersButton = (): PageElement => cy.get('[data-qa=clear-filters]')

  private searchResultsTable = (): PageElement => cy.get('[data-qa=search-results-table]')

  private zeroResultsMessage = (): PageElement => cy.get('[data-qa=zero-results-message]')

  private paginationControls = (): PageElement => cy.get('[data-qa=search-results-pagination] ul')

  private paginationResultsCount = (): PageElement => cy.get('[data-qa=search-results-pagination] p')

  private paginationFirstLink = (): PageElement => cy.get('[data-qa=search-results-pagination] ul li:first-of-type a')

  private paginationLastLink = (): PageElement => cy.get('[data-qa=search-results-pagination] ul li:last-of-type a')

  private sortableTableHeaders = (): PageElement => cy.get('[data-qa=sortable-table-headers]')

  private searchUnavailbleMessage = (): PageElement => cy.get('[data-qa=search-unavailable-message]')
}
