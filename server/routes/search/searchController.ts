import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SearchController {
  getSearchView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { searchResults, searchTerm, sortField, sortDirection } = res.locals
    const viewRenderArgs = { searchResults, searchTerm, sortField, sortDirection }
    return res.render('pages/search/index', viewRenderArgs)
  }
}
