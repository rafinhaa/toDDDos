import { InferSelectModel } from "drizzle-orm"

import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Task } from "@/domain/entities/task"
import { tasks } from "@/infra/database/drizzle/config/schema"

type TasksColumns = InferSelectModel<typeof tasks>

export class DrizzleTaskMapper {
  static toDomain(raw: TasksColumns): Task {
    return Task.create(
      {
        title: raw.title,
        status: raw.status,
        userId: new UniqueEntityId(raw.userId),
        createdAt: raw.createdAt,
        completedAt: raw.completedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toDrizzle(task: Task) {
    return {
      id: task.id.toString(),
      title: task.title,
      userId: task.userId.toString(),
      completedAt: task.completedAt,
    }
  }
}
