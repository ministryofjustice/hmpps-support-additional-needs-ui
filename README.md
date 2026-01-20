# HMPPS Support for Additional Needs - UI

[![repo standards badge](https://img.shields.io/endpoint?labelColor=231f20&color=005ea5&style=flat&label=MoJ%20Compliant&url=https%3A%2F%2Foperations-engineering-reports-prod.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fendpoint%2Fhmpps-support-additional-needs-ui&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAHJElEQVRYhe2YeYyW1RWHnzuMCzCIglBQlhSV2gICKlHiUhVBEAsxGqmVxCUUIV1i61YxadEoal1SWttUaKJNWrQUsRRc6tLGNlCXWGyoUkCJ4uCCSCOiwlTm6R/nfPjyMeDY8lfjSSZz3/fee87vnnPu75z3g8/kM2mfqMPVH6mf35t6G/ZgcJ/836Gdug4FjgO67UFn70+FDmjcw9xZaiegWX29lLLmE3QV4Glg8x7WbFfHlFIebS/ANj2oDgX+CXwA9AMubmPNvuqX1SnqKGAT0BFoVE9UL1RH7nSCUjYAL6rntBdg2Q3AgcAo4HDgXeBAoC+wrZQyWS3AWcDSUsomtSswEtgXaAGWlVI2q32BI0spj9XpPww4EVic88vaC7iq5Hz1BvVf6v3qe+rb6ji1p3pWrmtQG9VD1Jn5br+Knmm70T9MfUh9JaPQZu7uLsR9gEsJb3QF9gOagO7AuUTom1LpCcAkoCcwQj0VmJregzaipA4GphNe7w/MBearB7QLYCmlGdiWSm4CfplTHwBDgPHAFmB+Ah8N9AE6EGkxHLhaHU2kRhXc+cByYCqROs05NQq4oR7Lnm5xE9AL+GYC2gZ0Jmjk8VLKO+pE4HvAyYRnOwOH5N7NhMd/WKf3beApYBWwAdgHuCLn+tatbRtgJv1awhtd838LEeq30/A7wN+AwcBt+bwpD9AdOAkYVkpZXtVdSnlc7QI8BlwOXFmZ3oXkdxfidwmPrQXeA+4GuuT08QSdALxC3OYNhBe/TtzON4EziZBXD36o+q082BxgQuqvyYL6wtBY2TyEyJ2DgAXAzcC1+Xxw3RlGqiuJ6vE6QS9VGZ/7H02DDwAvELTyMDAxbfQBvggMAAYR9LR9J2cluH7AmnzuBowFFhLJ/wi7yiJgGXBLPq8A7idy9kPgvAQPcC9wERHSVcDtCfYj4E7gr8BRqWMjcXmeB+4tpbyG2kG9Sl2tPqF2Uick8B+7szyfvDhR3Z7vvq/2yqpynnqNeoY6v7LvevUU9QN1fZ3OTeppWZmeyzRoVu+rhbaHOledmoQ7LRd3SzBVeUo9Wf1DPs9X90/jX8m/e9Rn1Mnqi7nuXXW5+rK6oU7n64mjszovxyvVh9WeDcTVnl5KmQNcCMwvpbQA1xE8VZXhwDXAz4FWIkfnAlcBAwl6+SjD2wTcmPtagZnAEuA3dTp7qyNKKe8DW9UeBCeuBsbsWKVOUPvn+MRKCLeq16lXqLPVFvXb6r25dlaGdUx6cITaJ8fnpo5WI4Wuzcjcqn5Y8eI/1F+n3XvUA1N3v4ZamIEtpZRX1Y6Z/DUK2g84GrgHuDqTehpBCYend94jbnJ34DDgNGArQT9bict3Y3p1ZCnlSoLQb0sbgwjCXpY2blc7llLW1UAMI3o5CD4bmuOlwHaC6xakgZ4Z+ibgSxnOgcAI4uavI27jEII7909dL5VSrimlPKgeQ6TJCZVQjwaOLaW8BfyWbPEa1SaiTH1VfSENd85NDxHt1plA71LKRvX4BDaAKFlTgLeALtliDUqPrSV6SQCBlypgFlbmIIrCDcAl6nPAawmYhlLKFuB6IrkXAadUNj6TXlhDcCNEB/Jn4FcE0f4UWEl0NyWNvZxGTs89z6ZnatIIrCdqcCtRJmcCPwCeSN3N1Iu6T4VaFhm9n+riypouBnepLsk9p6p35fzwvDSX5eVQvaDOzjnqzTl+1KC53+XzLINHd65O6lD1DnWbepPBhQ3q2jQyW+2oDkkAtdt5udpb7W+Q/OFGA7ol1zxu1tc8zNHqXercfDfQIOZm9fR815Cpt5PnVqsr1F51wI9QnzU63xZ1o/rdPPmt6enV6sXqHPVqdXOCe1rtrg5W7zNI+m712Ir+cer4POiqfHeJSVe1Raemwnm7xD3mD1E/Z3wIjcsTdlZnqO8bFeNB9c30zgVG2euYa69QJ+9G90lG+99bfdIoo5PU4w362xHePxl1slMab6tV72KUxDvzlAMT8G0ZohXq39VX1bNzzxij9K1Qb9lhdGe931B/kR6/zCwY9YvuytCsMlj+gbr5SemhqkyuzE8xau4MP865JvWNuj0b1YuqDkgvH2GkURfakly01Cg7Cw0+qyXxkjojq9Lw+vT2AUY+DlF/otYq1Ixc35re2V7R8aTRg2KUv7+ou3x/14PsUBn3NG51S0XpG0Z9PcOPKWSS0SKNUo9Rv2Mmt/G5WpPF6pHGra7Jv410OVsdaz217AbkAPX3ubkm240belCuudT4Rp5p/DyC2lf9mfq1iq5eFe8/lu+K0YrVp0uret4nAkwlB6vzjI/1PxrlrTp/oNHbzTJI92T1qAT+BfW49MhMg6JUp7ehY5a6Tl2jjmVvitF9fxo5Yq8CaAfAkzLMnySt6uz/1k6bPx59CpCNxGfoSKA30IPoH7cQXdArwCOllFX/i53P5P9a/gNkKpsCMFRuFAAAAABJRU5ErkJggg==)](https://operations-engineering-reports-prod.cloud-platform.service.justice.gov.uk/public-report/hmpps-support-additional-needs-ui)
[![Docker Repository on ghcr](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-support-additional-needs-ui)

Support for additional needs enables staff to better support prisoners with neurodiversity and other additional learning needs.

Staff can record a prisoner's challenges, strengths, conditions and support recommendations, and view these alongside the relevant screener results.
Education departments can use the service to create and review the prisoner's education support plan which is contractually required, to better support prisoners with additional needs in education.
This contractual information links to Curious, the contract management system for Education.

# Development and maintenance

## Imported Types
Some types are imported from the Open API docs for support-additional-needs-api, manage-users-api, prisoner-search-api,
curious-api and prison-register-api.
You will need to install the node module `openapi-typescript` globally with the following command:

`npm install -g openapi-typescript`

To update the types from the Open API docs run the following commands:

```shell
npx openapi-typescript https://support-for-additional-needs-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/supportAdditionalNeedsApi/index.d.ts
npx openapi-typescript https://prisoner-search-dev.prison.service.justice.gov.uk/v3/api-docs -o server/@types/prisonerSearchApi/index.d.ts
npx openapi-typescript https://prison-register-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/prisonRegisterApi/index.d.ts
npx openapi-typescript https://manage-users-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/manageUsersApi/index.d.ts
npx openapi-typescript https://testservices.sequation.net/sequation-virtual-campus2-api/v3/api-docs -o server/@types/curiousApi/index.d.ts
```

Note that you will need to run prettier over the generated files and possibly handle other errors before compiling.

The types are inherited for use in `server/@types/supportAdditionalNeedsApiClient/index.d.ts`,
`server/@types/manageUsersApiClient/index.d.ts`, `server/@types/prisonerSearchApiClient/index.d.ts`,
`server/@types/curiousApiClient/index.d.ts` and `server/@types/prisonerRegisterApiClient/index.d.ts` which may
also need tweaking for use.

Do not re-import the specs lightly! Reformatting the generated code with prettier is no small task, especially with
large specs such as Prisoner Search.

### Dependencies

### HMPPS Auth
The app requires:
* hmpps-auth - for authentication
* redis - session store and token caching

## Running the app via docker-compose

The easiest way to run the app is to use docker compose to create the service and all dependencies.

`docker compose pull`

`docker compose up`

### Running the app for development

To start the main services excluding the example typescript template app:

`docker compose up --scale=app=0`

Create an environment file by copying `.env.example` -> `.env`
Environment variables set in here will be available when running `start:dev`

Install dependencies using `npm install`, ensuring you are using `node v20`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder
to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json`
and the github pipeline build config.

And then, to build the assets and start the app with esbuild:

`npm run start:dev`


### Auth Code flow

These are used to allow authenticated users to access the application. After the user is redirected from auth back to
the application, the typescript app will use the returned auth code to request a JWT token for that user containing the
user's roles. The JWT token will be verified and then stored in the user's session.

These credentials are configured using the following env variables:

- `AUTH_CODE_CLIENT_ID`
- `AUTH_CODE_CLIENT_SECRET`

### Client Credentials flow
The client creds environment variables are `CLIENT_CREDS_CLIENT_ID` and `CLIENT_CREDS_CLIENT_ID`. The client requires the following roles:

* `ROLE_SUPPORT_ADDITIONAL_NEEDS__SEARCH__RO` - to be able to call the Support Additional Needs API; search endpoint
* `ROLE_SUPPORT_ADDITIONAL_NEEDS__ELSP__RW` - to be able to call the Support Additional Needs API; plan, conditions, challenges, strengths endpoint

In addition a specific client for accessing the Curious REST API is required. The env vars are `CURIOUS_API_CLIENT_ID` and `CURIOUS_API_CLIENT_SECRET`.
This client should only carry the role `ROLE_CURIOUS_API` and no others.

### User Roles
Once the UI is running users will need to authenticate with `hmpps-auth` using a valid DPS user. The DPS roles that the user
has determines the functionality they will be able to access:

* `ROLE_SAN_EDITOR`
* `ROLE_SAN_EDUCATION_MANAGER`

### Run linter

* `npm run lint` runs `eslint`.
* `npm run typecheck` runs the TypeScript compiler `tsc`.

### Run unit tests

`npm run test`

### Running integration tests

For local running, start a wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)

## Feature Toggles
Features can be toggled by setting the relevant environment variable.

| Name                    | Default Value | Type     | Description                                             |
|-------------------------|---------------|----------|---------------------------------------------------------|
| SOME_TOGGLE_ENABLED     | false         | Boolean  | Example feature toggle, for demonstration purposes.     |
| EDIT_EHCP_ENABLED       | false         | Boolean  | Set to true to enable the edit EHCP functionality.      |
| NEW_ESP_JOURNEY_ENABLED | false         | Boolean  | Set to true to enable the new ESP journey.              |
| DPR_REPORT_ENABLED      | false         | Boolean  | Set to true to enable the link to the DPR reporting UI. |

