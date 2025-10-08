import type { Person } from 'supportAdditionalNeedsApiClient'
import Page from '../../pages/page'
import SearchPage from '../../pages/search/searchPage'
import OverviewPage from '../../pages/profile/overviewPage'
import SearchSortField from '../../../server/enums/searchSortField'

/**
 * Cypress scenarios for the Search page.
 *
 * These scenarios are for the Search page only and make use of large numbers of randomly generated prisoner data,
 * suitable for asserting the functionality of the Search page itself (such as paging, filtering and sorting).
 *
 * Scenarios that need to click "into" a specific prisoner record to get to the Overview page will need some extra stubbing
 * in order to set specific stubs in the API for the specific prisoner clicked on.
 */
context('Search screen', () => {
  let peopleGroupedByPageRequest: Array<Array<Person>>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })

    // Generate 725 Prisoner Search Summaries that will be displayed on the Search page by virtue of using them in the search API stub.
    // 725 is a very specific number and is used because it will mean we have 15 pages (14 pages of 50, plus 1 of 25)
    // This means we can assert elements of the paging such as Previous, Next, the number of page links, the "sliding window of 10" page links etc
    cy.task('generatePeople', 725).then((people: Array<Person>) => {
      peopleGroupedByPageRequest = new Array(15)
      for (let i = 0; i < 15; i += 1) {
        peopleGroupedByPageRequest[i] = people.slice(i * 50, (i + 1) * 50)
      }
      peopleGroupedByPageRequest.forEach((pageOfPeople, idx) => {
        cy.task('stubSearchByPrison', {
          page: idx + 1,
          pageOfPrisoners: pageOfPeople,
          totalRecords: 725,
          sortBy: SearchSortField.DEADLINE_DATE,
        })
      })
    })
  })

  it('should be able to navigate directly to the search page', () => {
    // Given
    cy.signIn()
    const expectedResultCount = 725

    // When
    cy.visit('/search')

    // Then
    Page.verifyOnPage(SearchPage) //
      .hasResultsDisplayed(expectedResultCount)
      .searchUnavailableMessageIsNotDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display service unavailable message given search API returns a 500', () => {
    // Given
    cy.signIn()
    cy.task('stubSearchByPrison500Error', { sortBy: SearchSortField.DEADLINE_DATE })

    // When
    cy.visit('/search')

    // Then
    Page.verifyOnPage(SearchPage) //
      .searchUnavailableMessageIsDisplayed()
      .apiErrorBannerIsDisplayed()
  })

  describe('pagination', () => {
    it('should display pagination controls, displaying 1 to 10 with the next link, on the first page of the search results', () => {
      // Given
      cy.signIn()

      // When
      cy.visit('/search')

      // Then
      Page.verifyOnPage(SearchPage) //
        .paginationCurrentPageIs(1)
        .hasPaginationLinkForPage(2)
        .hasPaginationLinkForPage(3)
        .hasPaginationLinkForPage(4)
        .hasPaginationLinkForPage(5)
        .hasPaginationLinkForPage(6)
        .hasPaginationLinkForPage(8)
        .hasPaginationLinkForPage(9)
        .hasPaginationLinkForPage(10)
        .hasNextLinkDisplayed()
    })

    it('should display pagination controls, displaying 2 to 11 with the next and previous links, on the 7th page of the search results', () => {
      // Given
      cy.signIn()
      cy.visit('/search')
      const searchPage = Page.verifyOnPage(SearchPage)

      // When
      searchPage.gotoPage(7)

      // Then
      searchPage //
        .hasPreviousLinkDisplayed()
        .hasPaginationLinkForPage(2)
        .hasPaginationLinkForPage(3)
        .hasPaginationLinkForPage(4)
        .hasPaginationLinkForPage(5)
        .hasPaginationLinkForPage(6)
        .paginationCurrentPageIs(7)
        .hasPaginationLinkForPage(8)
        .hasPaginationLinkForPage(9)
        .hasPaginationLinkForPage(10)
        .hasPaginationLinkForPage(11)
        .hasNextLinkDisplayed()
    })
  })

  it('should be able to click a prisoner on the search page to arrive on the Overview page', () => {
    // Given
    cy.signIn()
    const firstPersonOnFirstPage: Person = peopleGroupedByPageRequest[0][0]
    cy.task('getPrisonerById', firstPersonOnFirstPage.prisonNumber)
    cy.task('stubGetPlanActionStatus', { prisonNumber: firstPersonOnFirstPage.prisonNumber })
    cy.visit('/search')

    // Then
    Page.verifyOnPage(SearchPage) //
      .gotoOverviewPageForPrisoner(firstPersonOnFirstPage.prisonNumber)

    // When
    Page.verifyOnPage(OverviewPage)
  })

  context('Search screen for users with different permissions', () => {
    it('should show the basic search page given user does not have the manager role', () => {
      // Given
      cy.task('stubSignIn', { roles: ['ROLE_SOME_ROLE_THAT_IS_NOT_SAN_MANAGER'] })
      cy.signIn()
      peopleGroupedByPageRequest.forEach((pageOfPeople, idx) => {
        cy.task('stubSearchByPrison', {
          page: idx + 1,
          pageOfPrisoners: pageOfPeople,
          totalRecords: 725,
          sortBy: SearchSortField.PRISONER_NAME,
        })
      })

      // When
      cy.visit('/search')

      // Then
      Page.verifyOnPage(SearchPage) //
        .doesNotHaveStatusAndDueDateColumnsDisplayed()
    })

    it('should show the search page with all columns given user does have the manager role', () => {
      // Given
      cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] })
      cy.signIn()

      // When
      cy.visit('/search')

      // Then
      Page.verifyOnPage(SearchPage) //
        .hasStatusAndDueDateColumnsDisplayed()
    })
  })
})
