import { Injectable } from "@nestjs/common";
import { User } from "../entity/user";
import { UserEntity } from "src/user/infrastructure/entity/user.entity";
import { UserDto } from "src/user/presentation/dto/response/user.dto";

@Injectable()
export class UserMapper {
  toDomainFromEntity(entity: UserEntity): User {
    return new User(entity.id, entity.name);
  }

  toDomainFromDto(dto: UserDto): User {
    return new User(dto.id, dto.name);
  }

  toEntity(domain: User): UserEntity {
    return UserEntity.fromDomain(domain);
  }
  toDto(domain: User): UserDto {
    return new UserDto(domain.id, domain.name);
  }
}
