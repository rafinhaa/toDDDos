import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

export type UserProps = {
  email: string
  password: string
  createdAt?: Date
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  setEmail(email: string) {
    this.props.email = email
  }

  setPassword(password: string) {
    this.props.password = password
  }

  setCreatedAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    return new User(props, id)
  }
}
