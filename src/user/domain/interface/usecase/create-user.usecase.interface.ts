import { IUseCase } from "src/common/interface/usecase/usecase.interface";
import { CreateUserDto } from "src/user/presentation/dto/request/create-user.dto";
import { UserDto } from "src/user/presentation/dto/response/user.dto";

export interface ICreateUserUseCase extends IUseCase<CreateUserDto, UserDto> {}
