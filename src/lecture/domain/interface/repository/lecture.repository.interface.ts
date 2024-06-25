import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { EntityManager } from "typeorm";
import { Lecture } from "../../entity/lecture";

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

  findAll(): Promise<LectureEntity[]>;
}
