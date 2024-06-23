import { InjectRepository } from "@nestjs/typeorm";
import { IUserRepository } from "src/user/domain/interface/repository/user.repository.interface";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { User } from "src/user/domain/entity/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(user: User): Promise<UserEntity> {
    const userEntity = UserEntity.fromDomain(user);
    return await this.userRepository.save(userEntity);
  }
}
