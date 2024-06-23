import { UserEntity } from "src/user/infrastructure/entity/user.entity";
import { UserDto } from "src/user/presentation/dto/response/user.dto";

export class User {
  private _id: number;
  private _name: string;

  constructor(id: number, name: string) {
    this._id = id;
    this._name = name;

    if (name.trim().length === 0) {
      throw new Error("이름은 비어있을 수 없습니다.");
    }

    if (name.length > 100) {
      throw new Error("이름은 100자를 초과할 수 없습니다.");
    }
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  static create(name: string): User {
    return new User(0, name);
  }

  toDto(): UserDto {
    return new UserDto(this._id, this._name);
  }
}
