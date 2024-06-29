import { LectureDetail } from "src/lecture/domain/entity/lecture-detail";
import { LectureDetailEntity } from "src/lecture/infrastructure/entity/lecture-detail.entity";
import { EntityManager } from "typeorm";
import { LockMode } from "../../enum/lock-mode.enum";

export interface ILectureDetailRepository {
  findByIdWithLock(
    id: number,
    entityManager: EntityManager,
    lockMode: LockMode
  ): Promise<LectureDetailEntity>;
  update(
    lectureDetail: LectureDetail,
    entityManager: EntityManager
  ): Promise<LectureDetailEntity>;
  create(
    lectureDetail: LectureDetail,
    entityManager: EntityManager
  ): Promise<LectureDetailEntity>;

  findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureDetailEntity>;

  findByLectureId(lectureId: number): Promise<LectureDetailEntity[]>;
}
