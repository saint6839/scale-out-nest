import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/domain/entity/user";
import { IUserRepository } from "src/user/domain/interface/repository/user.repository.interface";
import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }
  async create(user: User): Promise<UserEntity> {
    const userEntity = UserEntity.fromDomain(user);
    return await this.userRepository.save(userEntity);
  }
}
