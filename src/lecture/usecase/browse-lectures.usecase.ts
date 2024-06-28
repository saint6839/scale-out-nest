import { Inject, Injectable } from "@nestjs/common";
import { Lecture } from "../domain/entity/lecture";
import { LectureDetail } from "../domain/entity/lecture-detail";
import { ILectureDetailRepository } from "../domain/interface/repository/lecture-deteail.repository.interface";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { IBrowseLecturesUseCase } from "../domain/interface/usecase/browse-lectures.usecase.interface";
import { LectureDetailMapper } from "../domain/mapper/lecture-detail.mapper";
import { LectureMapper } from "../domain/mapper/lecture.mapper";
import { LectureDetailRepository } from "../infrastructure/repository/lecture-detail.repository";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { LectureDto } from "../presentation/dto/response/lecture.dto";

@Injectable()
export class BrowseLecturesUseCase implements IBrowseLecturesUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    @Inject(LectureDetailRepository.name)
    private readonly lectureDetailRepository: ILectureDetailRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly lectureDetailMapper: LectureDetailMapper
  ) {}

  /**
   * @description 모든 강의 목록과 해당 강의의 상세 일정을 모두 조회하는 usecase
   * @returns LectureDto[]
   */
  async execute(): Promise<LectureDto[]> {
    const lectures = await this.fetchAllLectures();
    return await Promise.all(
      lectures.map(async (lecture) => {
        const lectureDetails = await this.fetchLectureDetails(lecture);
        return this.lectureMapper.toDtoFromDomain(lecture, lectureDetails);
      })
    );
  }

  /**
   * @description 모든 강의 목록을 조회하는 함수
   * @returns Lecture[]
   */
  private async fetchAllLectures(): Promise<Lecture[]> {
    const lectureEntities = await this.lectureRepository.findAll();
    const lectures = lectureEntities.map((entity) =>
      this.lectureMapper.toDomainFromEntity(entity)
    );
    return lectures;
  }

  /**
   * @description 특정 강의의 상세 일정을 조회하는 함수
   * @param lecture
   * @returns LectureDetail[]
   */
  private async fetchLectureDetails(
    lecture: Lecture
  ): Promise<LectureDetail[]> {
    const lectureDetailEntities =
      await this.lectureDetailRepository.findByLectureId(lecture.id);
    const lectureDetails = lectureDetailEntities.map((entity) =>
      this.lectureDetailMapper.toDomainFromEntity(entity)
    );
    return lectureDetails;
  }
}
