import { Inject, Injectable } from "@nestjs/common";
import { User } from "../domain/entity/user";
import { IUserRepository } from "../domain/interface/repository/user.repository.interface";
import { ICreateUserUseCase } from "../domain/interface/usecase/create-user.usecase.interface";
import { UserMapper } from "../domain/mapper/user.mapper";
import { UserRepository } from "../infrastructure/repository/user.repository";
import { CreateUserDto } from "../presentation/dto/request/create-user.dto";
import { UserDto } from "../presentation/dto/response/user.dto";

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @Inject(UserRepository.name)
    private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper
  ) {}

  /**
   * @description 사용자 생성 usecase
   * @param dto
   * @returns UserDto
   */
  async execute(dto: CreateUserDto): Promise<UserDto> {
    const user = User.create(dto.name);
    const userEntity = await this.userRepository.create(user);
    const createdUser = this.userMapper.toDomainFromEntity(userEntity);
    return this.userMapper.toDto(createdUser);
  }
}
