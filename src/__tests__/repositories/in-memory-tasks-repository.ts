import { User } from "@/domain/entities/user";
import { TasksRepository } from "@/application/repositories/tasks-repository";
import { Task } from "@/domain/entities/task";
import { TaskStatus } from "@/domain/value-objects/task-status";

export class InMemoryTasksRepository implements TasksRepository {
  public items: Task[] = [];

  async create(task: Task) {
    this.items.push(task);
  }

  async findManyByUserId(user: User ): Promise<Task[] | null> {
    return this.items.filter(item => item.userId.toString() === user.id.toString()) || null
  }

  async deleteTask(task: Task): Promise<void> {
    this.items.filter(item => item.id.toString() !== task.id.toString())
  }

  async completeTask(task: Task): Promise<void> {
    this.items.map(item => item.id.toString() === task.id.toString() ? {
      ...item,
      status: TaskStatus.DONE
    } : item)
  }
}