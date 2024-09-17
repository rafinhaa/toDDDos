import { title } from "process"

import { Task } from "@/domain/entities/task"

export class TaskPresenter {
  static toHTTP(task: Task) {
    return {
      id: task.id.toString(),
      title: task.title,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
    }
  }
}
