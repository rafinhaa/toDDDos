import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { CreateUserUseCase } from "@/application/use-cases/create-users"
import { DatabaseUsersRepository } from "@/infra/database"
import { HashGenerator } from "@/infra/encryption"

const bodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      })
    }
  })

const schema = {
  body: bodySchema,
}

export const users: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/register",
    {
      schema,
    },
    async (req, rep) => {
      const { email, password } = req.body

      const result = await new CreateUserUseCase(
        new DatabaseUsersRepository(),
        new HashGenerator(),
      ).execute({
        email,
        password,
      })

      if (result.isLeft()) throw result.value

      return rep.status(201)
    },
  )
}
