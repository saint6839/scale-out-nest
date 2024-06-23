import { EntityManager } from "typeorm";
import { LectureApplicationHistory } from "../../entity/lecture-application-history";
import { LectureApplicationHistoryEntity } from "src/lecture/infrastructure/entity/lecture-application-history.entity";

export interface ILectureApplicationHistoryRepository {
  create(
    lectureApplicationHistory: LectureApplicationHistory,
    entityManager: EntityManager
  ): Promise<LectureApplicationHistoryEntity>;

  findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureApplicationHistoryEntity>;
}
