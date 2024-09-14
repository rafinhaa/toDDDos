import { TaskStatus } from '@/domain/value-objects/task-status';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

export type TaskProps = {
  title: string;
  userId: UniqueEntityId;
  status?: TaskStatus;
}

export class Task extends Entity<TaskProps> {

  get title() {
    return this.props.title;
  }

  get status(): TaskStatus | undefined {
    return this.props.status;
  }

  get userId() {
    return this.props.userId;
  }

  set title(title: string) {
    this.props.title = title;
  }

  set status(status: TaskStatus) {
    this.props.status = status;
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId;
  }

  static create(props: TaskProps, id?: UniqueEntityId) {
    const initialStatus = props.status || TaskStatus.PENDING;
    const task = { ...props, status: initialStatus };

    return new Task(task, id);
  }
}