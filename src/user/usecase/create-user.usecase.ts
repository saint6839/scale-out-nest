import { UserEntity } from "src/user/infrastructure/entity/user.entity";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "../infrastructure/repository/user.repository";
import { ICreateUserUseCase } from "../domain/interface/usecase/create-user.usecase.interface";
import { CreateUserDto } from "../presentation/dto/request/create-user.dto";
import { UserDto } from "../presentation/dto/response/user.dto";
import { UserMapper } from "../domain/mapper/user.mapper";
import { User } from "../domain/entity/user";

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper
  ) {}

  async execute(dto: CreateUserDto): Promise<UserDto> {
    const user = this.userMapper.toDomainFromDto(User.create(dto.name));
    const userEntity = await this.userRepository.create(user);
    const createdUser = this.userMapper.toDomainFromEntity(userEntity);
    return this.userMapper.toDto(createdUser);
  }
}
