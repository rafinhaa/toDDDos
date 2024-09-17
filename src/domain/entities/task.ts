import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { TaskStatus } from "@/domain/value-objects/task-status"

export type TaskProps = {
  title: string
  userId: UniqueEntityId
  status?: TaskStatus
  createdAt?: Date
  completedAt?: Date | null
}

export class Task extends Entity<TaskProps> {
  get title() {
    return this.props.title
  }

  get status(): TaskStatus | undefined {
    return this.props.status
  }

  get userId() {
    return this.props.userId
  }

  get createdAt(): Date | null {
    return this.props.createdAt || null
  }

  get completedAt(): Date | null {
    return this.props.completedAt || null
  }

  set title(title: string) {
    this.props.title = title
  }

  set status(status: TaskStatus) {
    this.props.status = status
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  set completedAt(completedAt: Date | null) {
    this.props.completedAt = completedAt
  }

  static create(props: TaskProps, id?: UniqueEntityId) {
    const initialStatus = props.status || TaskStatus.PENDING
    const task = { ...props, status: initialStatus, createdAt: new Date() }

    return new Task(task, id)
  }
}
