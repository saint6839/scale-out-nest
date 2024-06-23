import { ICreateLectureUseCase as ICreateLectureUseCase } from "src/lecture/domain/interface/usecase/create-lecture.usecase.interface";
import { CreateLectureUseCase } from "../../usecase/create-lecture.usecase";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateLectureDto } from "../dto/request/create-lecture.dto";
import { LectureDto } from "../dto/response/lecture.dto";
import { ApiResponseDto } from "src/common/api/api-response.dto";
import { IEnrollLectureUseCase } from "src/lecture/domain/interface/usecase/enroll-lecture.usecase.interface";
import { EnrollLectureUseCase } from "src/lecture/usecase/enroll-lecture.usecase";
import { EnrollLectureDto } from "../dto/request/enroll-lecture.dto";

@Controller("/lectures")
export class LectureController {
  constructor(
    @Inject(CreateLectureUseCase.name)
    private readonly createLectureUseCase: ICreateLectureUseCase,
    @Inject(EnrollLectureUseCase.name)
    private readonly enrollLectureUseCase: IEnrollLectureUseCase
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

  @Post("/enrollments")
  async enroll(
    @Body() dto: EnrollLectureDto
  ): Promise<ApiResponseDto<LectureDto>> {
    return new ApiResponseDto(
      true,
      "강의 등록 성공",
      await this.enrollLectureUseCase.execute(dto)
    );
  }
}
