import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubCuriousApiPing = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/curious-api/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'text/plan;charset=UTF-8' },
      body: 'pong',
    },
  })

export default { stubCuriousApiPing }
