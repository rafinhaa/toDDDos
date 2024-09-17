import { eq } from "drizzle-orm"

import { TasksRepository } from "@/application/repositories/tasks-repository"
import { Task } from "@/domain/entities/task"
import { User } from "@/domain/entities/user"
import { db } from "@/infra/database/drizzle/config"
import { tasks } from "@/infra/database/drizzle/config/schema"
import { DrizzleTaskMapper } from "@/infra/database/drizzle/mappers/drizzle-tasks-mapper"

export class DrizzleTasksRepository implements TasksRepository {
  async create(task: Task) {
    await db.insert(tasks).values(DrizzleTaskMapper.toDrizzle(task))
  }

  async findManyByUserId({ id }: Pick<User, "id">): Promise<Task[]> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, id.toString()))

    return result.map(DrizzleTaskMapper.toDomain)
  }

  async findById({ id }: Pick<Task, "id">): Promise<Task | null> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id.toString()))

    const task = result[0]

    if (!task) return null

    return DrizzleTaskMapper.toDomain(result[0])
  }

  async deleteTask(task: Task): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, task.id.toString()))
  }

  async completeTask(task: Task): Promise<void> {
    await db
      .update(tasks)
      .set(DrizzleTaskMapper.toDrizzle(task))
      .where(eq(tasks.id, task.id.toString()))
  }
}
