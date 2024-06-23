import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateUserUseCase } from "src/user/usecase/create-user.usecase";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UserDto } from "../dto/response/user.dto";
import { ICreateUserUseCase } from "src/user/domain/interface/usecase/create-user.usecase.interface";
import { ApiResponseDto } from "src/common/api/api-response.dto";

@Controller("/users")
export class UserController {
  constructor(
    @Inject(CreateUserUseCase.name)
    private readonly createUserUseCase: ICreateUserUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ApiResponseDto<UserDto>> {
    return new ApiResponseDto(
      true,
      "사용자 생성 성공",
      await this.createUserUseCase.execute(dto)
    );
  }
}
