import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { AuthUserUseCase } from "@/application/use-cases/auth-user"
import { CreateUserUseCase } from "@/application/use-cases/create-users"
import { DatabaseUsersRepository } from "@/infra/database"
import { HashComparer } from "@/infra/encryption"
import { HashGenerator } from "@/infra/encryption"
import { UserPresenter } from "@/infra/http/presenters/user-presenter"

const signInBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerBodySchema = z
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

export const auth: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/sign-in",
    {
      schema: {
        body: signInBodySchema,
      },
    },
    async (req, rep) => {
      const { email, password } = req.body

      const result = await new AuthUserUseCase(
        new DatabaseUsersRepository(),
        new HashComparer(),
      ).execute({
        email,
        password,
      })

      if (result.isLeft()) throw result.value

      const user = UserPresenter.toHTTP(result.value.user)

      const token = app.jwt.sign({ id: user.id })

      return rep.status(200).send({ token })
    },
  )

  app.post(
    "/register",
    {
      schema: {
        body: registerBodySchema,
      },
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
