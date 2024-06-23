import { ILectureRepository } from "src/lecture/domain/interface/repository/lecture.repository.interface";
import { Lecture } from "./../../domain/entity/lecture";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LectureEntity } from "../entity/lecture.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class LectureRepository implements ILectureRepository {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>
  ) {}

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
    const repository = entityManager;
    return await repository.save(lectureEntity);
  }
}
