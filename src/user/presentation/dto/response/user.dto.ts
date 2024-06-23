import { User } from "src/user/domain/entity/user";

export class UserDto {
  readonly id: number;
  readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
