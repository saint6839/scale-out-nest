import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserUseCase } from "src/user/usecase/create-user.usecase";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UserDto } from "../dto/response/user.dto";

@Controller("/users")
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute(dto);
  }
}
