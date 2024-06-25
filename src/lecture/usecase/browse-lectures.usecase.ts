import { Inject, Injectable } from "@nestjs/common";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { IBrowseLecturesUseCase } from "../domain/interface/usecase/browse-lectures.usecase.interface";
import { LectureMapper } from "../domain/mapper/lecture.mapper";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { LectureDto } from "../presentation/dto/response/lecture.dto";

@Injectable()
export class BrowseLecturesUseCase implements IBrowseLecturesUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    private readonly lectureMapper: LectureMapper
  ) {}
  async execute(): Promise<LectureDto[]> {
    const lectureEntities = await this.lectureRepository.findAll();
    const lectures = lectureEntities.map((entity) =>
      this.lectureMapper.toDomainFromEntity(entity)
    );
    return lectures.map((lecture) =>
      this.lectureMapper.toDtoFromDomain(lecture)
    );
  }
}
