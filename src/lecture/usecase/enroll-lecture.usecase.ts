import { LectureEnrollmentHistory } from "src/lecture/domain/entity/lecture-enrollment-history";
import { LectureMapper } from "./../domain/mapper/lecture.mapper";
import { Inject, Injectable } from "@nestjs/common";
import { IEnrollLectureUseCase } from "../domain/interface/usecase/enroll-lecture.usecase.interface";
import { EnrollLectureDto } from "../presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "../presentation/dto/response/lecture.dto";
import { LectureRepository } from "../infrastructure/repository/lecture.repository";
import { ILectureRepository } from "../domain/interface/repository/lecture.repository.interface";
import { DataSource, EntityManager } from "typeorm";
import { ILectureApplicationHistoryRepository } from "../domain/interface/repository/lecture-application-history.repository.interface";
import { Lecture } from "../domain/entity/lecture";
import { LectureEnrollmentHistoryRepository } from "../infrastructure/repository/lecture-enrollment-history.repository";

export const NOT_EXIST_LECTURE_EXCEPTION_MESSAGE = "존재하지 않는 강의 입니다";
export const ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE =
  "이미 수강신청한 강의 입니다";

@Injectable()
export class EnrollLectureUseCase implements IEnrollLectureUseCase {
  constructor(
    @Inject(LectureRepository.name)
    private readonly lectureRepository: ILectureRepository,
    @Inject(LectureEnrollmentHistoryRepository.name)
    private readonly lectureApplicationHistory: ILectureApplicationHistoryRepository,
    private readonly lectureMapper: LectureMapper,
    private readonly dataSource: DataSource
  ) {}

  /**
   * @description 특정 강의에 대한 특정 유저의 수강 신청 정보를 저장하는 usecase
   * @description 수강 신청을 하기 전에 이미 수강 신청한 이력이 있는지 확인하고, 없다면 수강 신청을 진행하고, 강의의 수강 인원을 증가시킨다.
   * @param dto userId, lectureId
   * @returns LectureDto
   */
  async execute(dto: EnrollLectureDto): Promise<LectureDto> {
    return await this.dataSource.transaction(
      async (entityManger: EntityManager) => {
        const lecture = await this.findLecture(dto, entityManger);
        await this.validateExistLectureEnrollmentHistory(dto, entityManger);
        await this.enrollLecture(dto, entityManger);
        return await this.increaseEnrollmentCount(lecture, entityManger);
      }
    );
  }

  /**
   * @description 강의의 수강 인원을 증가시키는 함수
   * @param lecture
   * @param entityManger
   * @returns LectureDto
   */
  private async increaseEnrollmentCount(
    lecture: Lecture,
    entityManger: EntityManager
  ) {
    lecture.increaseEnrollment();
    const updatedLectureEntity = await this.lectureRepository.update(
      lecture,
      entityManger
    );
    const updatedLecture =
      this.lectureMapper.toDomainFromEntity(updatedLectureEntity);
    return this.lectureMapper.toDtoFromDomain(updatedLecture);
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
      dto.lectureId,
      dto.userId
    );
    await this.lectureApplicationHistory.create(
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
    entityManger: EntityManager
  ): Promise<void> {
    const existLectureApplicationHistoryEntity =
      await this.lectureApplicationHistory.findByLectureIdAndUserId(
        dto.lectureId,
        dto.userId,
        entityManger
      );

    if (existLectureApplicationHistoryEntity) {
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
  private async findLecture(
    dto: EnrollLectureDto,
    entityManger: EntityManager
  ): Promise<Lecture> {
    const lectureEntity = await this.lectureRepository.findById(
      dto.lectureId,
      entityManger
    );
    if (!lectureEntity) throw new Error(NOT_EXIST_LECTURE_EXCEPTION_MESSAGE);
    return this.lectureMapper.toDomainFromEntity(lectureEntity);
  }
}
