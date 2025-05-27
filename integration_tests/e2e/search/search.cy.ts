import type { Person } from 'supportAdditionalNeedsApiClient'
import Page from '../../pages/page'
import SearchPage from '../../pages/search/searchPage'

/**
 * Cypress scenarios for the Search page.
 *
 * These scenarios are for the Search page only and make use of large numbers of randomly generated prisoner data,
 * suitable for asserting the functionality of the Search page itself (such as paging, filtering and sorting).
 *
 * Scenarios that need to click "into" a specific prisoner record to get to the Overview page will need some extra stubbing
 * in order to set specific stubs in the API for the specific prisoner clicked on.
 */
context(`Display the Search screen`, () => {
  let peopleGroupedByPageRequest: Array<Array<Person>>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()

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
        })
      })
    })
  })

  it('should be able to navigate directly to the search page', () => {
    // Given
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
    cy.task('stubSearchByPrison500Error')

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
})
