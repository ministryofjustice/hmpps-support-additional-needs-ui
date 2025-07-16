/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { initialiseName } from './utils'
import config from '../config'
import logger from '../../logger'
import formatDateFilter from '../filters/formatDateFilter'
import fallbackMessageFilter from '../filters/fallbackMessageFilter'
import formatYesNoFilter from '../filters/formatYesNoFilter'
import findErrorFilter from '../filters/findErrorFilter'
import formatPrisonerNameFilter, { NameFormat } from '../filters/formatPrisonerNameFilter'
import formatPlanRefusalReasonFilter from '../filters/formatPlanRefusalReasonFilter'
import {
  formatStrengthCategoryHintTextFilter,
  formatStrengthCategoryScreenValueFilter,
} from '../filters/formatStrengthCategoryFilter'
import formatStrengthIdentificationSourceScreenValueFilter from '../filters/formatStrengthIdentificationSourceFilter'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'HMPPS Support Additional Needs Ui'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  njkEnv.addFilter('findError', findErrorFilter)
  njkEnv.addFilter('formatDate', formatDateFilter)
  njkEnv.addFilter('fallbackMessage', fallbackMessageFilter)
  njkEnv.addFilter('formatYesNo', formatYesNoFilter)
  njkEnv.addFilter('formatPlanRefusalReason', formatPlanRefusalReasonFilter)
  njkEnv.addFilter('formatStrengthCategoryScreenValue', formatStrengthCategoryScreenValueFilter)
  njkEnv.addFilter('formatStrengthCategoryHintText', formatStrengthCategoryHintTextFilter)
  njkEnv.addFilter('formatStrengthIdentificationSourceScreenValue', formatStrengthIdentificationSourceScreenValueFilter)

  // Name format filters
  njkEnv.addFilter('formatFIRST_NAME_ONLY', formatPrisonerNameFilter(NameFormat.FIRST_NAME_ONLY))
  njkEnv.addFilter('formatLAST_NAME_ONLY', formatPrisonerNameFilter(NameFormat.LAST_NAME_ONLY))
  njkEnv.addFilter('formatFIRST_NAME_LAST_NAME', formatPrisonerNameFilter(NameFormat.FIRST_NAME_LAST_NAME))
  njkEnv.addFilter('formatLAST_NAME_FIRST_NAME', formatPrisonerNameFilter(NameFormat.LAST_NAME_FIRST_NAME))
  njkEnv.addFilter('formatFIRST_NAME_COMMA_LAST_NAME', formatPrisonerNameFilter(NameFormat.FIRST_NAME_COMMA_LAST_NAME))
  njkEnv.addFilter('formatLAST_NAME_COMMA_FIRST_NAME', formatPrisonerNameFilter(NameFormat.LAST_NAME_COMMA_FIRST_NAME))
  njkEnv.addFilter('formatFirst_name_only', formatPrisonerNameFilter(NameFormat.First_name_only))
  njkEnv.addFilter('formatLast_name_only', formatPrisonerNameFilter(NameFormat.Last_name_only))
  njkEnv.addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  njkEnv.addFilter('formatLast_name_First_name', formatPrisonerNameFilter(NameFormat.Last_name_First_name))
  njkEnv.addFilter('formatFirst_name_comma_Last_name', formatPrisonerNameFilter(NameFormat.First_name_comma_Last_name))
  njkEnv.addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))

  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
  njkEnv.addGlobal('featureToggles', config.featureToggles)
}
