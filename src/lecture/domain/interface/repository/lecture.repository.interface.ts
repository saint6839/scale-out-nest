import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { Lecture } from "../../entity/lecture";
import { EntityManager } from "typeorm";

export interface ILectureRepository {
  create(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity>;

  findById(id: number, entityManager: EntityManager): Promise<LectureEntity>;
}
