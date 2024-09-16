import { User } from "@/domain/entities/user";
import { TasksRepository } from "@/application/repositories/tasks-repository";
import { Task } from "@/domain/entities/task";

export class InMemoryTasksRepository implements TasksRepository {
  public items: Task[] = [];

  async create(task: Task) {
    this.items.push(task);
  }

  async findManyByUserId(user: User ): Promise<Task[]> {
    return this.items.filter(item => item.userId.toString() === user.id.toString())
  }

  async findById({ id }: Pick<Task, "id">): Promise<Task | null> {
    return this.items.find(item => item.id.toString() === id.toString()) || null
  }

  async deleteTask(task: Task): Promise<void> {
    this.items.filter(item => item.id.toString() !== task.id.toString())
  }

  async completeTask(task: Task): Promise<void> {
    const taskIndex = this.items.findIndex(item => item.id.toString() === task.id.toString());
    this.items[taskIndex] = task
  }
}