import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { CreateTaskUseCase } from "@/application/use-cases/create-task"
import { FetchTasksUseCase } from "@/application/use-cases/fetch-tasks"
import {
  DatabaseTasksRepository,
  DatabaseUsersRepository,
} from "@/infra/database"

import { TaskPresenter } from "../presenters/task-presenter"

const createTaskSchema = z.object({
  title: z.string(),
})

export const users: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/:userId/tasks",
    {
      schema: {
        body: createTaskSchema,
        params: z.object({ userId: z.string().uuid() }),
      },
    },
    async (req, rep) => {
      const { title } = req.body
      const { userId } = req.params

      const result = await new CreateTaskUseCase(
        new DatabaseTasksRepository(),
        new DatabaseUsersRepository(),
      ).execute({
        title,
        userId,
      })

      if (result.isLeft()) throw result.value

      const task = TaskPresenter.toHTTP(result.value.task)

      return rep.status(201).send({
        task,
      })
    },
  )

  app.get(
    "/:userId/tasks",
    {
      schema: {
        params: z.object({ userId: z.string().uuid() }),
      },
    },
    async (req, rep) => {
      const { userId } = req.params

      const result = await new FetchTasksUseCase(
        new DatabaseTasksRepository(),
        new DatabaseUsersRepository(),
      ).execute({
        userId,
      })

      if (result.isLeft()) throw result.value

      const tasks = result.value.tasks.map(TaskPresenter.toHTTP)

      return rep.status(201).send({
        tasks,
      })
    },
  )
}
