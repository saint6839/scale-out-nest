import { UserEntity } from "src/user/infrastructure/entity/user.entity";
import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "../infrastructure/repository/user.repository";
import { ICreateUserUseCase } from "../domain/interface/usecase/create-user.usecase.interface";
import { CreateUserDto } from "../presentation/dto/request/create-user.dto";
import { UserDto } from "../presentation/dto/response/user.dto";
import { UserMapper } from "../domain/mapper/user.mapper";
import { User } from "../domain/entity/user";
import { IUserRepository } from "../domain/interface/repository/user.repository.interface";

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @Inject(UserRepository.name)
    private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper
  ) {}

  async execute(dto: CreateUserDto): Promise<UserDto> {
    const user = User.create(dto.name);
    const userEntity = await this.userRepository.create(user);
    const createdUser = this.userMapper.toDomainFromEntity(userEntity);
    return this.userMapper.toDto(createdUser);
  }
}
