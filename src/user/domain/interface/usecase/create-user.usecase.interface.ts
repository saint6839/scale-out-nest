import { CreateUserDto } from "src/user/presentation/dto/request/create-user.dto";
import { UserDto } from "src/user/presentation/dto/response/user.dto";

export interface ICreateUserUseCase {
  execute(dto: CreateUserDto): Promise<UserDto>;
}
