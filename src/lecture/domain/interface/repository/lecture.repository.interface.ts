import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { EntityManager } from "typeorm";
import { Lecture } from "../../entity/lecture";
import { LockMode } from "../../enum/lock-mode.enum";

export interface ILectureRepository {
  create(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity>;

  findById(id: number, entityManager: EntityManager): Promise<LectureEntity>;

  findByIdWithLock(
    id: number,
    entityManager: EntityManager,
    lockMode: LockMode
  ): Promise<LectureEntity>;

  update(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity>;

  findAll(): Promise<LectureEntity[]>;
}
