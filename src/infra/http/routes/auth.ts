import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { AuthUserUseCase } from "@/application/use-cases/auth-user"
import { DatabaseUsersRepository } from "@/infra/database"
import { HashComparer } from "@/infra/encryption"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const schema = {
  body: bodySchema,
}

export const auth: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/",
    {
      schema,
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

      const token = app.jwt.sign({ id: result.value.user.id.toString() })

      return rep.status(200).send({ token })
    },
  )
}
