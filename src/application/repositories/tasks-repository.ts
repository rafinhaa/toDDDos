import { Task } from "@/domain/entities/task"
import { User } from "@/domain/entities/user"

export interface TasksRepository {
  create(task: Task): Promise<void>
  findManyByUserId(user: User): Promise<Task[]>
  findById(id: Pick<Task, "id">): Promise<Task | null>
  deleteTask(task: Task): Promise<void>
  completeTask(task: Task): Promise<void>
}
