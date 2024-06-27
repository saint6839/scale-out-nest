import { Inject, Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { Lecture } from "../domain/entity/lecture";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { ICreateLectureUseCase } from "../domain/interface/usecase/create-lecture.usecase.interface";
import { LectureMapper } from "../domain/mapper/lecture.mapper";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { CreateLectureDto } from "../presentation/dto/request/create-lecture.dto";
import { LectureDto } from "../presentation/dto/response/lecture.dto";

@Injectable()
export class CreateLectureUseCase implements ICreateLectureUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly dataSource: DataSource
  ) {}

  async execute(dto: CreateLectureDto): Promise<LectureDto> {
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const lecture = Lecture.create(dto.name);
        const lectureEntity = await this.lectureRepository.create(
          lecture,
          entityManager
        );
        const createdLecture =
          this.lectureMapper.toDomainFromEntity(lectureEntity);
        return this.lectureMapper.toDtoFromDomain(createdLecture);
      }
    );
  }
}
