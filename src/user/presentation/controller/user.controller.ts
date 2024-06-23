import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateUserUseCase } from "src/user/usecase/create-user.usecase";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UserDto } from "../dto/response/user.dto";
import { ICreateUserUseCase } from "src/user/domain/interface/usecase/create-user.usecase.interface";

@Controller("/users")
export class UserController {
  constructor(
    @Inject(CreateUserUseCase.name)
    private readonly createUserUseCase: ICreateUserUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute(dto);
  }
}
