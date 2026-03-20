import fastifyEnv from '@fastify/env'
import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: string;
    }
  }
}

const appProperties = {
  type: 'object',
  // required: ['PORT']
  properties: {
    PORT: {
      type: 'number',
      default: 4000
    },
  }
}

const options = {
  confKey: 'config',
  schema: appProperties,
  dotenv: true
}

export const createApp = async () => {
  const app = fastify({ logger: true })

  await app.register(fastifyEnv, options)

  return app
}