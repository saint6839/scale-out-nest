import { IEnrollLectureUseCase } from "src/lecture/domain/interface/usecase/enroll-lecture.usecase.interface";
import { EnrollLectureUseCase } from "./../../usecase/enroll-lecture.usecase";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { EnrollLectureDto } from "../dto/request/enroll-lecture.dto";
import { LectureDto } from "../dto/response/lecture.dto";

@Controller("/lectures")
export class LectureController {
  constructor(
    @Inject(EnrollLectureUseCase.name)
    private readonly enrollLectureUseCase: IEnrollLectureUseCase
  ) {}

  @Post()
  async enroll(@Body() dto: EnrollLectureDto): Promise<LectureDto> {
    return this.enrollLectureUseCase.execute(dto);
  }
}
