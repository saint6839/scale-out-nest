import { LectureMapper } from "./../domain/mapper/lecture.mapper";
import { Inject, Injectable } from "@nestjs/common";
import { IEnrollLectureUseCase } from "../domain/interface/usecase/enroll-lecture.usecase.interface";
import { EnrollLectureDto } from "../presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "../presentation/dto/response/lecture.dto";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { DataSource, EntityManager } from "typeorm";

@Injectable()
export class EnrollLectureUseCase implements IEnrollLectureUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly dataSource: DataSource
  ) {}

  async execute(dto: EnrollLectureDto): Promise<LectureDto> {
    const result = this.dataSource.transaction(
      async (entityManger: EntityManager) => {
        const lecture = await this.lectureRepository.findById(
          dto.lectureId,
          entityManger
        );
      }
    );
  }
}
