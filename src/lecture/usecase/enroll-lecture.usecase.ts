import { Inject, Injectable } from "@nestjs/common";
import { ICreateLectureUseCase } from "../domain/interface/usecase/enroll-lecture.usecase.interface";
import { CreateLectureDto } from "../presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "../presentation/dto/response/lecture.dto";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { LectureMapper } from "../domain/mapper/lecture.mapper";
import { Lecture } from "../domain/entity/lecture";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";

@Injectable()
export class EnrollLectureUseCase implements ICreateLectureUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    private readonly lectureMapper: LectureMapper
  ) {}

  async execute(dto: CreateLectureDto): Promise<LectureDto> {
    const lecture = Lecture.create(dto.name, dto.startAt, dto.capacity);
    const lectureEntity = await this.lectureRepository.create(lecture);
    const createdLecture = this.lectureMapper.toDomainFromEntity(lectureEntity);
    return this.lectureMapper.toDto(createdLecture);
  }
}
