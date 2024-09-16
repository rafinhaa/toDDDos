import { faker } from "@faker-js/faker"

import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Task } from "@/domain/entities/task"
import { TaskStatus } from "@/domain/value-objects/task-status"

export const makeTask = (override?: Partial<Task>): Task => {
  return Task.create({
    id: new UniqueEntityId(),
    title: faker.lorem.words(),
    userId: new UniqueEntityId(),
    status: TaskStatus.PENDING,
    ...override,
  })
}
