import { LectureEnrollmentHistoryEntity } from "src/lecture/infrastructure/entity/lecture-enrollment-history.entity";
import { EntityManager } from "typeorm";
import { LectureEnrollmentHistory } from "../../entity/lecture-enrollment-history";

export interface ILectureEnrollmentHistoryRepository {
  create(
    lectureApplicationHistory: LectureEnrollmentHistory,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity>;

  findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity>;

  findByLectureIdAndUserId(
    lectureId: number,
    userId: number,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity>;
}
