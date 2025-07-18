import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'

const production = process.env.NODE_ENV === 'production'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toBoolean = (value: unknown): boolean => {
  return value === 'true'
}

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

const auditConfig = () => {
  const auditEnabled = get('AUDIT_ENABLED', 'false') === 'true'
  return {
    enabled: auditEnabled,
    queueUrl: get(
      'AUDIT_SQS_QUEUE_URL',
      'http://localhost:4566/000000000000/mainQueue',
      auditEnabled && requiredInProduction,
    ),
    serviceName: get('AUDIT_SERVICE_NAME', 'UNASSIGNED', auditEnabled && requiredInProduction),
    region: get('AUDIT_SQS_REGION', 'eu-west-2'),
  }
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: process.env.NO_HTTPS === 'true' ? false : production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  activeAgencies: get('ACTIVE_AGENCIES', '', requiredInProduction),
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      authClientId: get('AUTH_CODE_CLIENT_ID', 'clientid', requiredInProduction),
      authClientSecret: get('AUTH_CODE_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('CLIENT_CREDS_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('CLIENT_CREDS_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      curiousClientId: get('CURIOUS_API_CLIENT_ID', 'clientid', requiredInProduction),
      curiousClientSecret: get('CURIOUS_API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    prisonerSearch: {
      url: get('PRISONER_SEARCH_API_URL', 'http://localhost:8083', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('PRISONER_SEARCH_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('PRISONER_SEARCH_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_SEARCH_API_TIMEOUT_RESPONSE', 5000))),
      defaultPageSize: Number(get('PRISONER_SEARCH_API_DEFAULT_PAGE_SIZE', 9999, requiredInProduction)),
    },
    prisonRegister: {
      url: get('PRISON_REGISTER_API_URL', 'http://localhost:8083', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('PRISON_REGISTER_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('PRISON_REGISTER_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('PRISON_REGISTER_API_TIMEOUT_RESPONSE', 5000))),
    },
    manageUsersApi: {
      url: get('MANAGE_USERS_API_URL', 'http://localhost:9091', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('MANAGE_USERS_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 5000))),
    },
    supportAdditionalNeedsApi: {
      url: get('SUPPORT_ADDITIONAL_NEEDS_API_URL', 'http://localhost:9091', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('SUPPORT_ADDITIONAL_NEEDS_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('SUPPORT_ADDITIONAL_NEEDS_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('SUPPORT_ADDITIONAL_NEEDS_API_TIMEOUT_RESPONSE', 5000))),
    },
    curious: {
      url: get('CURIOUS_API_URL', 'http://localhost:8083', requiredInProduction),
      healthPath: '/ping',
      timeout: {
        response: Number(get('CURIOUS_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('CURIOUS_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('CURIOUS_API_TIMEOUT_RESPONSE', 5000))),
    },
  },
  sqs: {
    audit: auditConfig(),
  },
  ingressUrl: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  dpsHomeUrl: get('DPS_URL', 'http://localhost:3000/', requiredInProduction),
  newDpsUrl: get('NEW_DPS_URL', 'http://localhost:3000/', requiredInProduction),
  applicationInsights: {
    connectionString: get('APPLICATIONINSIGHTS_CONNECTION_STRING', null),
  },
  searchUiDefaultPaginationPageSize: Number(get('SEARCH_UI_DEFAULT_PAGINATION_PAGE_SIZE', 50, requiredInProduction)),
  featureToggles: {
    // someToggleEnabled: toBoolean(get('SOME_TOGGLE_ENABLED', false)),
  },
}
