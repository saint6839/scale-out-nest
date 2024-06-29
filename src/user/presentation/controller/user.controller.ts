import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiResponseDto } from "src/common/api/api-response.dto";
import { ICreateUserUseCase } from "src/user/domain/interface/usecase/create-user.usecase.interface";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UserDto } from "../dto/response/user.dto";

@Controller("/users")
export class UserController {
  constructor(
    @Inject("ICreateUserUseCase")
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
