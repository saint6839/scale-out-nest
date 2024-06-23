import { Inject, Injectable } from "@nestjs/common";
import { ICreateLectureUseCase } from "../domain/interface/usecase/enroll-lecture.usecase.interface";
import { CreateLectureDto } from "../presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "../presentation/dto/response/lecture.dto";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { LectureMapper } from "../domain/mapper/lecture.mapper";
import { Lecture } from "../domain/entity/lecture";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { DataSource, EntityManager } from "typeorm";

@Injectable()
export class EnrollLectureUseCase implements ICreateLectureUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly dataSource: DataSource
  ) {}

  async execute(dto: CreateLectureDto): Promise<LectureDto> {
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const lecture = Lecture.create(dto.name, dto.startAt, dto.capacity);
        const lectureEntity = await this.lectureRepository.create(
          lecture,
          entityManager
        );
        const createdLecture =
          this.lectureMapper.toDomainFromEntity(lectureEntity);
        return this.lectureMapper.toDto(createdLecture);
      }
    );
  }
}
