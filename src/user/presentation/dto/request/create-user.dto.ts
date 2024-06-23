import { User } from "src/user/domain/entity/user";

export class CreateUserDto {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  toDomain(): User {
    return User.create(this.name);
  }
}
