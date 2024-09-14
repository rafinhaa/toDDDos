
import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export type UserProps = {
    email: string;
    password: string;
}

export class User extends Entity<UserProps> {

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  setEmail(email: string) {
    this.props.email = email;
  }

  setPassword(password: string) {
    this.props.password = password;
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    return new User(props, id);
  }
}
