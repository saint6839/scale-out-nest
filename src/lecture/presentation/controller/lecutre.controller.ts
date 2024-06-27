import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiResponseDto } from "src/common/api/api-response.dto";
import { IBrowseLectureEnrollmentHistoriesUseCase } from "src/lecture/domain/interface/usecase/browse-lecture-enrollment-histories.usecase.inteface";
import { IBrowseLecturesUseCase } from "src/lecture/domain/interface/usecase/browse-lectures.usecase.interface";
import { ICreateLectureUseCase } from "src/lecture/domain/interface/usecase/create-lecture.usecase.interface";
import { IEnrollLectureUseCase } from "src/lecture/domain/interface/usecase/enroll-lecture.usecase.interface";
import { BrowseLectureEnrollmentHistoriesDto } from "src/lecture/presentation/dto/request/browse-lecture-enrollment-histories.dto";
import { BrowseLecturesUseCase } from "src/lecture/usecase/browse-lectures.usecase";
import { EnrollLectureUseCase } from "src/lecture/usecase/enroll-lecture.usecase";
import { CreateLectureUseCase } from "../../usecase/create-lecture.usecase";
import { CreateLectureDto } from "../dto/request/create-lecture.dto";
import { EnrollLectureDto } from "../dto/request/enroll-lecture.dto";
import { LectureDto } from "../dto/response/lecture.dto";
import { BrowseLectureEnrollmentHistoriesUseCase } from "./../../usecase/browse-lecture-enrollment-histories.usecase";

@Controller("/lectures")
export class LectureController {
  constructor(
    @Inject(CreateLectureUseCase.name)
    private readonly createLectureUseCase: ICreateLectureUseCase,
    @Inject(EnrollLectureUseCase.name)
    private readonly enrollLectureUseCase: IEnrollLectureUseCase,
    @Inject(BrowseLectureEnrollmentHistoriesUseCase.name)
    private readonly browseLectureEnrollmentHistoriesUseCase: IBrowseLectureEnrollmentHistoriesUseCase,
    @Inject(BrowseLecturesUseCase.name)
    private readonly browseLecturesUseCase: IBrowseLecturesUseCase
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

  @Get()
  async get(): Promise<ApiResponseDto<LectureDto[]>> {
    return new ApiResponseDto(
      true,
      "전체 강의 목록 조회 성공",
      await this.browseLecturesUseCase.execute()
    );
  }

  @Post("/enrollments")
  async enroll(@Body() dto: EnrollLectureDto): Promise<ApiResponseDto<void>> {
    return new ApiResponseDto(
      true,
      "강의 등록 성공",
      await this.enrollLectureUseCase.execute(dto)
    );
  }

  @Get("/enrollments")
  async getEnrollments(
    @Query() dto: BrowseLectureEnrollmentHistoriesDto
  ): Promise<ApiResponseDto<LectureDto[]>> {
    return new ApiResponseDto(
      true,
      "수강 신청 목록 조회 성공",
      await this.browseLectureEnrollmentHistoriesUseCase.execute(dto)
    );
  }
}
