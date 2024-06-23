import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { Lecture } from "../../entity/lecture";
import { EntityManager, UpdateResult } from "typeorm";

export interface ILectureRepository {
  create(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity>;

  findById(id: number, entityManager: EntityManager): Promise<LectureEntity>;

  update(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity>;
}
