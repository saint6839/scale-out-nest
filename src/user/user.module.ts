import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserMapper } from "./domain/mapper/user.mapper";
import { UserEntity } from "./infrastructure/entity/user.entity";
import { UserRepository } from "./infrastructure/repository/user.repository";
import { UserValidatorService } from "./infrastructure/service/user.validator.service";
import { UserController } from "./presentation/controller/user.controller";
import { CreateUserUseCase } from "./usecase/create-user.usecase";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: ["IUserValidator"],
  providers: [
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "ICreateUserUseCase",
      useClass: CreateUserUseCase,
    },
    {
      provide: "IUserValidator",
      useClass: UserValidatorService,
    },
    UserMapper,
  ],
  controllers: [UserController],
})
export class UserModule {}
