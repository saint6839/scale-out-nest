import { Inject, Injectable } from "@nestjs/common";
import { LectureEnrollmentHistory } from "src/lecture/domain/entity/lecture-enrollment-history";
import { DataSource, EntityManager } from "typeorm";
import { LectureDetail } from "../domain/entity/lecture-detail";
import { LockMode } from "../domain/enum/lock-mode.enum";
import { ILectureDetailRepository } from "../domain/interface/repository/lecture-deteail.repository.interface";
import { ILectureEnrollmentHistoryRepository } from "../domain/interface/repository/lecture-enrollment-history.repository.interface";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { IEnrollLectureUseCase } from "../domain/interface/usecase/enroll-lecture.usecase.interface";
import { LectureDetailMapper } from "../domain/mapper/lecture-detail.mapper";
import { LectureDetailRepository } from "../infrastructure/repository/lecture-detail.repository";
import { LectureEnrollmentHistoryRepository } from "../infrastructure/repository/lecture-enrollment-history.repository";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { EnrollLectureDto } from "../presentation/dto/request/enroll-lecture.dto";
import { LectureMapper } from "./../domain/mapper/lecture.mapper";

export const NOT_EXIST_LECTURE_DETAIL_EXCEPTION_MESSAGE =
  "신청 불가능한 강의 입니다";
export const ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE =
  "이미 수강신청한 강의 입니다";

@Injectable()
export class EnrollLectureUseCase implements IEnrollLectureUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    @Inject(LectureEnrollmentHistoryRepository.name)
    private readonly lectureEnrollmentHistory: ILectureEnrollmentHistoryRepository,
    @Inject(LectureDetailRepository.name)
    private readonly lectureDetailRepository: ILectureDetailRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly lectureDetailMapper: LectureDetailMapper,
    private readonly dataSource: DataSource
  ) {}

  /**
   * @description 특정 강의에 대한 특정 유저의 수강 신청 정보를 저장하는 usecase
   * @description 수강 신청을 하기 전에 이미 수강 신청한 이력이 있는지 확인하고, 없다면 수강 신청을 진행하고, 강의의 수강 인원을 증가시킨다.
   * @param dto userId, lectureId
   * @returns LectureDto
   */
  async execute(dto: EnrollLectureDto): Promise<void> {
    return await this.dataSource.transaction(
      async (entityManger: EntityManager) => {
        const lectureDetail = await this.findLectureDetail(dto, entityManger);
        await this.validateExistLectureEnrollmentHistory(
          dto,
          lectureDetail,
          entityManger
        );
        await this.enrollLecture(dto, entityManger);
        return await this.increaseLectureDetailCurrentEnrollment(
          lectureDetail,
          entityManger
        );
      }
    );
  }

  /**
   * @description 강의의 수강 인원을 증가시키는 함수
   * @param lectureDetail
   * @param entityManger
   * @returns LectureDto
   */
  private async increaseLectureDetailCurrentEnrollment(
    lectureDetail: LectureDetail,
    entityManger: EntityManager
  ): Promise<void> {
    lectureDetail.increaseEnrollment();
    await this.lectureDetailRepository.update(lectureDetail, entityManger);
  }

  /**
   * @description 수강 신청 이력을 저장하는 함수
   * @param dto
   * @param entityManger
   */
  private async enrollLecture(
    dto: EnrollLectureDto,
    entityManger: EntityManager
  ) {
    const lectureEnrollmentHistory = LectureEnrollmentHistory.create(
      dto.lectureDetailId,
      dto.userId
    );
    await this.lectureEnrollmentHistory.create(
      lectureEnrollmentHistory,
      entityManger
    );
  }

  /**
   * @description 이미 수강 신청한 이력이 있는지 확인하는 함수
   * @throws {Error} 존재하는 강의가 없다면 예외를 발f생시킨다.
   * @param dto
   * @param entityManger
   */
  private async validateExistLectureEnrollmentHistory(
    dto: EnrollLectureDto,
    lectureDetail: LectureDetail,
    entityManger: EntityManager
  ): Promise<void> {
    const existLectureEnrollmentHistoryEntity =
      await this.lectureEnrollmentHistory.findByLectureIdAndUserId(
        lectureDetail.lectureId,
        dto.userId,
        entityManger
      );

    if (existLectureEnrollmentHistoryEntity) {
      throw new Error(ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE);
    }
  }

  /**
   * @description 강의를 찾는 함수
   * @throws {Error} 존재하는 강의가 없다면 예외를 발생시킨다.
   * @param dto
   * @param entityManger
   * @returns Lecture
   */
  private async findLectureDetail(
    dto: EnrollLectureDto,
    entityManger: EntityManager
  ): Promise<LectureDetail> {
    const lectureDetailEntity =
      await this.lectureDetailRepository.findByIdWithLock(
        dto.lectureDetailId,
        entityManger,
        LockMode.PESSIMISTIC_WRITE
      );

    if (!lectureDetailEntity)
      throw new Error(NOT_EXIST_LECTURE_DETAIL_EXCEPTION_MESSAGE);
    const lectureDetail =
      this.lectureDetailMapper.toDomainFromEntity(lectureDetailEntity);

    lectureDetail.validateEnrollStartAt(new Date());
    return lectureDetail;
  }
}
