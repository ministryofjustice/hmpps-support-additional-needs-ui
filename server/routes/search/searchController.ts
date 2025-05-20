import { NextFunction, Request, RequestHandler, Response } from 'express'
import SearchSortField from '../../enums/searchSortField'
import SearchSortDirection from '../../enums/searchSortDirection'

const DEFAULT_SORT_FIELD = SearchSortField.PRISONER_NAME
const DEFAULT_SORT_DIRECTION = SearchSortDirection.ASC

export default class SearchController {
  getSearchView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = (req.query.searchTerm as string) || ''
    const sortField = (req.query.sortField as string) || DEFAULT_SORT_FIELD
    const sortDirection = (req.query.sortDirection as string) || DEFAULT_SORT_DIRECTION

    const viewRenderArgs = { searchTerm, sortField, sortDirection }
    return res.render('pages/search/index', viewRenderArgs)
  }
}
