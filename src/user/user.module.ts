import { Module } from "@nestjs/common";
import { UserRepository } from "./infrastructure/repository/user.repository";
import { UserController } from "./presentation/controller/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./infrastructure/entity/user.entity";
import { CreateUserUseCase } from "./usecase/create-user.usecase";
import { UserMapper } from "./domain/mapper/user.mapper";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepository.name,
      useClass: UserRepository,
    },
    {
      provide: CreateUserUseCase.name,
      useClass: CreateUserUseCase,
    },
    UserMapper,
  ],
  controllers: [UserController],
})
export class UserModule {}
