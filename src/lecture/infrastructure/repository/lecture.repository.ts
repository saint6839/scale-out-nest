import { ILectureRepository } from "src/lecture/domain/interface/repository/lecture.repository.interface";
import { Lecture } from "./../../domain/entity/lecture";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LectureEntity } from "../entity/lecture.entity";
import { EntityManager, Repository, UpdateResult } from "typeorm";

@Injectable()
export class LectureRepository implements ILectureRepository {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>
  ) {}
  async update(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity> {
    const entity = LectureEntity.fromDomain(lecture);
    await entityManager.update(
      LectureEntity,
      { id: lecture.id },
      {
        ...entity,
        version: () => "version + 1",
      }
    );

    return await entityManager.findOne(LectureEntity, {
      where: { id: lecture.id },
    });
  }

  async findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureEntity> {
    return await entityManager.findOne(LectureEntity, { where: { id } });
  }

  async create(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity> {
    const lectureEntity = LectureEntity.fromDomain(lecture);
    return await entityManager.save(lectureEntity);
  }
}
