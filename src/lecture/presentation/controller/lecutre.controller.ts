import { ICreateLectureUseCase as ICreateLectureUseCase } from "src/lecture/domain/interface/usecase/enroll-lecture.usecase.interface";
import { EnrollLectureUseCase } from "./../../usecase/enroll-lecture.usecase";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateLectureDto } from "../dto/request/enroll-lecture.dto";
import { LectureDto } from "../dto/response/lecture.dto";
import { ApiResponseDto } from "src/common/api/api-response.dto";

@Controller("/lectures")
export class LectureController {
  constructor(
    @Inject(EnrollLectureUseCase.name)
    private readonly createLectureUseCase: ICreateLectureUseCase
  ) {}

  @Post()
  async create(
    @Body() dto: CreateLectureDto
  ): Promise<ApiResponseDto<LectureDto>> {
    return new ApiResponseDto(
      true,
      "강의 등록 성공",
      await this.createLectureUseCase.execute(dto)
    );
  }
}
