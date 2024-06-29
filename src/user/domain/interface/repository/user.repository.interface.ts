import { UserEntity } from "src/user/infrastructure/entity/user.entity";
import { User } from "../../entity/user";

export interface IUserRepository {
  create(user: User): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity>;
}
