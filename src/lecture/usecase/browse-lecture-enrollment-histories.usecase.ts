import { Inject, Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { Lecture } from "../domain/entity/lecture";
import { LectureDetail } from "../domain/entity/lecture-detail";
import { LectureEnrollmentHistory } from "../domain/entity/lecture-enrollment-history";
import { ILectureDetailRepository } from "../domain/interface/repository/lecture-deteail.repository.interface";
import { ILectureEnrollmentHistoryRepository } from "../domain/interface/repository/lecture-enrollment-history.repository.interface";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { IBrowseLectureEnrollmentHistoriesUseCase } from "../domain/interface/usecase/browse-lecture-enrollment-histories.usecase.inteface";
import { LectureDetailMapper } from "../domain/mapper/lecture-detail.mapper";
import { LectureEnrollmentHistoryMapper } from "../domain/mapper/lecture-enrollment-history.mapper";
import { LectureMapper } from "../domain/mapper/lecture.mapper";
import { BrowseLectureEnrollmentHistoriesDto } from "../presentation/dto/request/browse-lecture-enrollment-histories.dto";
import { LectureDto } from "../presentation/dto/response/lecture.dto";

export const NOT_EXIST_LECTURE_ENROLLMENT_HISTORY_EXCEPTION_MESSAGE =
  "수강 신청 성공 이력이 존재하지 않습니다";

@Injectable()
export class BrowseLectureEnrollmentHistoriesUseCase
  implements IBrowseLectureEnrollmentHistoriesUseCase
{
  constructor(
    @Inject("ILectureRepository")
    private readonly lectureRepository: ILectureRepository,
    @Inject("ILectureEnrollmentHistoryRepository")
    private readonly lectureEnrollmentHistory: ILectureEnrollmentHistoryRepository,
    @Inject("ILectureDetailRepository")
    private readonly lectureDetailRepository: ILectureDetailRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly lectureEnrollmentHistoryMapper: LectureEnrollmentHistoryMapper,
    private readonly lectureDetailMapper: LectureDetailMapper,
    private readonly dataSource: DataSource
  ) {}

  async execute(
    dto: BrowseLectureEnrollmentHistoriesDto
  ): Promise<LectureDto[]> {
    return this.dataSource.transaction(async (entityManager) => {
      const histories = await this.fetchEnrollmentHistories(
        dto.userId,
        entityManager
      );
      this.validateHistoriesExist(histories);
      return await this.fetchLecturesFromHistories(histories, entityManager);
    });
  }

  private async fetchEnrollmentHistories(
    userId: number,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistory[]> {
    const entities = await this.lectureEnrollmentHistory.findByUserId(
      userId,
      entityManager
    );
    return entities.map((entity) =>
      this.lectureEnrollmentHistoryMapper.toDomainFromEntity(entity)
    );
  }

  private validateHistoriesExist(histories: LectureEnrollmentHistory[]): void {
    if (histories.length === 0) {
      throw new Error(NOT_EXIST_LECTURE_ENROLLMENT_HISTORY_EXCEPTION_MESSAGE);
    }
  }

  private async fetchLecturesFromHistories(
    histories: LectureEnrollmentHistory[],
    entityManager: EntityManager
  ): Promise<LectureDto[]> {
    const lectureMap = new Map<number, LectureDto>();

    for (const history of histories) {
      const { lecture, lectureDetail } = await this.fetchLectureAndDetail(
        history,
        entityManager
      );

      const lectureDomain = this.lectureMapper.toDomainFromEntity(lecture);
      const lectureDetailDomain =
        this.lectureDetailMapper.toDomainFromEntity(lectureDetail);

      this.updateLectureMap(lectureMap, lectureDomain, lectureDetailDomain);
    }

    return Array.from(lectureMap.values());
  }

  private async fetchLectureAndDetail(
    history: LectureEnrollmentHistory,
    entityManager: EntityManager
  ) {
    const lectureDetail = await this.lectureDetailRepository.findById(
      history.lectureDetailId,
      entityManager
    );
    const lecture = await this.lectureRepository.findById(
      lectureDetail.lectureId,
      entityManager
    );
    return { lecture, lectureDetail };
  }

  private updateLectureMap(
    lectureMap: Map<number, LectureDto>,
    lectureDomain: Lecture,
    lectureDetailDomain: LectureDetail
  ) {
    if (!lectureMap.has(lectureDomain.id)) {
      const lectureDto = this.lectureMapper.toDtoFromDomain(lectureDomain, [
        lectureDetailDomain,
      ]);
      lectureMap.set(lectureDomain.id, lectureDto);
    } else {
      const existingLectureDto = lectureMap.get(lectureDomain.id);
      existingLectureDto.lectureDetails.push(
        this.lectureDetailMapper.toDtoFromDomain(lectureDetailDomain)
      );
    }
  }
}
