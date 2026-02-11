import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SearchController {
  getSearchView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { searchResults, searchOptions } = res.locals
    return res.render('pages/search/index', { searchResults, searchOptions })
  }
}
