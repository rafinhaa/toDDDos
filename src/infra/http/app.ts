import fastify from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"
import { ZodError } from "zod"

import { ConflictError } from "@/application/use-cases/errors/conflict-error"
import { NotFoundError } from "@/application/use-cases/errors/not-found-error"
import { NotPermissionError } from "@/application/use-cases/errors/not-permission-error"
import { auth } from "@/infra/http/routes/auth"
import { users } from "@/infra/http/routes/user"

export const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(users, { prefix: "/users" })
app.register(auth, { prefix: "/auth" })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError)
    return reply.status(400).send({
      statusCode: 400,
      error: "Validation error",
      message: error.format(),
    })

  if (error instanceof ConflictError)
    return reply.status(409).send({
      statusCode: error.statusCode,
      message: error.message,
    })

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      statusCode: error.statusCode,
      message: error.message,
    })
  }

  if (error instanceof NotPermissionError) {
    return reply.status(403).send({
      statusCode: error.statusCode,
      message: error.message,
    })
  }

  reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Something went wrong",
  })
})
